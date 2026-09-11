import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '../lib/store';
import AuthShell from '../components/AuthShell';

const AUTH_DOMAIN = '@hkwallet.app';

function toAuthEmail(input: string): string {
  const trimmed = input.trim();
  if (trimmed.includes('@')) return trimmed;
  return `${trimmed.replace(/\D/g, '')}${AUTH_DOMAIN}`;
}

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (!trimmed.includes('@') && digits.length !== 10) {
      setError('Enter a valid 10 digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const email = toAuthEmail(trimmed);
      const res = await login(email, password);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      navigate(res.user!.role === 'user' ? '/' : '/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Login" intro="Welcome back to your wallet">
      <form onSubmit={submit}>
        <label>
          Mobile number
          <div className="phone-input">
            <span>
              +91 <em>|</em>
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
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
              placeholder="Please enter password"
              required
            />
          </div>
        </label>
        {error && <div className="error-box">{error}</div>}
        <button className="dark-button" disabled={loading}>
          {loading ? 'Please wait' : 'Login'}
        </button>
      </form>
    </AuthShell>
  );
}
