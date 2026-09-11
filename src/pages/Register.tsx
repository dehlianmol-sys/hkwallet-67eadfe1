import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Link, useLocation, useNavigate } from '@/lib/router-compat';
import { completeRegistration, requestRegistrationOtp } from '../lib/auth.functions';
import { useToast } from '../lib/toast';
import { lookupRefCode, REF_CODE_KEY } from '../lib/agents';
import AuthShell from '../components/AuthShell';

function storedRefCode(): string {
  if (typeof window === 'undefined') return '';
  try {
    return (localStorage.getItem(REF_CODE_KEY) ?? '').toUpperCase();
  } catch {
    return '';
  }
}

/* ------------------------------------------------------------------ */
/* OTP rate limiting (exponential backoff, persisted per phone number) */
/* ------------------------------------------------------------------ */
const OTP_RATE_PREFIX = 'hk_otp_rate_';

interface OtpRateRecord {
  attempts: number;
  lastRequestedAt: number;
  currentCooldown: number; // seconds to wait BEFORE the next request is allowed
}

function readOtpRate(phone: string): OtpRateRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(OTP_RATE_PREFIX + phone);
    return raw ? (JSON.parse(raw) as OtpRateRecord) : null;
  } catch {
    return null;
  }
}

function writeOtpRate(phone: string, record: OtpRateRecord) {
  try {
    localStorage.setItem(OTP_RATE_PREFIX + phone, JSON.stringify(record));
  } catch {
    /* ignore */
  }
}

/** Seconds remaining until the phone may request another OTP (0 = allowed). */
function cooldownRemaining(phone: string): number {
  const rec = readOtpRate(phone);
  if (!rec || !rec.lastRequestedAt || !rec.currentCooldown) return 0;
  const remaining = rec.currentCooldown - Math.floor((Date.now() - rec.lastRequestedAt) / 1000);
  return Math.max(0, remaining);
}

export default function Register({ referralCode }: { referralCode?: string } = {}) {
  const requestOtp = useServerFn(requestRegistrationOtp);
  const registerAccount = useServerFn(completeRegistration);
  const navigate = useNavigate();
  const { search } = useLocation();
  const toast = useToast();

  // Priority: /<code>/register path param, then legacy ?ref=CODE, then stored code.
  const lockedRef = (
    referralCode ??
    new URLSearchParams(search).get('ref') ??
    storedRefCode()
  ).toUpperCase();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0); // seconds remaining before next OTP request
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-fill the referral code from a pre-registration record when not locked by the link.
  useEffect(() => {
    if (lockedRef) return;
    let active = true;
    const t = setTimeout(async () => {
      const code = await lookupRefCode(phoneNumber);
      if (active && code) {
        try {
          localStorage.setItem(REF_CODE_KEY, code.toUpperCase());
        } catch {
          /* ignore */
        }
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [phoneNumber, lockedRef]);

  // Restore any persisted cooldown when the phone number changes (survives refresh).
  useEffect(() => {
    setCooldown(cooldownRemaining(phoneNumber));
  }, [phoneNumber]);

  // Tick the countdown down every second.
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        const next = c - 1;
        if (next <= 0 && timerRef.current) clearInterval(timerRef.current);
        return Math.max(0, next);
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetOtp = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (loading) return;
    setError('');

    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10 digit mobile number.');
      return;
    }
    if (!isOtpSent && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Rate limit: exponential backoff persisted per phone number.
    const remaining = cooldownRemaining(digits);
    if (remaining > 0) {
      setCooldown(remaining);
      toast(`Please wait ${remaining}s before requesting another OTP`, 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await requestOtp({ data: { phone: digits } });
      if (!result.ok) {
        setError(result.message);
        return;
      }

      // Persist backoff: 60s → 120s → 240s …
      const prev = readOtpRate(digits);
      const nextCooldown = prev?.currentCooldown ? prev.currentCooldown * 2 : 60;
      writeOtpRate(digits, {
        attempts: (prev?.attempts ?? 0) + 1,
        lastRequestedAt: Date.now(),
        currentCooldown: nextCooldown,
      });
      setCooldown(nextCooldown);

      setIsOtpSent(true);
      toast('OTP sent to your phone', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    setLoading(true);
    try {
      const digits = phoneNumber.replace(/\D/g, '');
      const agentId = lockedRef || (await lookupRefCode(digits)) || null;
      const res = await registerAccount({ data: { phone: digits, password, otp: enteredOtp, referredBy: agentId ?? undefined } });
      if (!res.ok) {
        setError(res.message);
        return;
      }

      try {
        localStorage.removeItem(REF_CODE_KEY);
        localStorage.removeItem(OTP_RATE_PREFIX + digits);
      } catch {
        /* ignore */
      }

      toast('Registration successful!', 'success');
      // Force app install instead of staying on the web app.
      navigate('/download', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create account" intro="Register with your phone number.">
      {!isOtpSent ? (
        <form onSubmit={handleGetOtp}>
          <label>
            Mobile number
            <div className="phone-input">
              <span>
                +91 <em>|</em>
              </span>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
                maxLength={10}
                placeholder="10 digit mobile number"
                required
              />
            </div>
          </label>
          <label>
            Password
            <div className="field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>
          </label>
          {error && <div className="error-box">{error}</div>}
          <button className="dark-button" disabled={loading || cooldown > 0}>
            {loading ? 'Please wait' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Get OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndRegister}>
          <label>
            Enter OTP
            <div className="field">
              <input
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                maxLength={6}
                placeholder="6 digit OTP"
                required
              />
            </div>
          </label>
          {error && <div className="error-box">{error}</div>}
          <button className="dark-button" disabled={loading}>
            {loading ? 'Please wait' : 'Verify & Register'}
          </button>
          <button
            type="button"
            className="dark-button"
            style={{ opacity: cooldown > 0 ? 0.6 : 1 }}
            disabled={loading || cooldown > 0}
            onClick={() => handleGetOtp()}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
          </button>
        </form>
      )}
      <p className="auth-switch">
        Already have an account? <Link to="/download">Download the App</Link>
      </p>
    </AuthShell>
  );
}
