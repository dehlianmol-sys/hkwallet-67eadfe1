import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const phoneSchema = z.string().regex(/^\d{10}$/);

export const requestRegistrationOtp = createServerFn({ method: 'POST' })
  .inputValidator((input) => z.object({ phone: phoneSchema }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: exists, error: existsError } = await supabaseAdmin.rpc('check_user_exists', { p_phone: data.phone });
    if (existsError) throw new Error('Could not check this phone number.');
    if (exists) return { ok: false as const, message: 'You are already registered. Please log in.' };
    const { data: otp, error: otpError } = await supabaseAdmin.rpc('issue_otp_challenge', { p_phone: data.phone });
    if (otpError || !otp) throw new Error(otpError?.message ?? 'Could not create OTP.');
    const endpoint = process.env['SMS_API_URL'];
    const apiKey = process.env['SMS_API_KEY'];
    if (!endpoint || !apiKey) throw new Error('SMS delivery is not configured yet.');
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ phone: data.phone, otp, senderType: 'FYDBZR' }) });
    if (!response.ok) throw new Error('Could not send OTP. Please try again.');
    return { ok: true as const };
  });

export const completeRegistration = createServerFn({ method: 'POST' })
  .inputValidator((input) => z.object({ phone: phoneSchema, password: z.string().min(6).max(72), otp: z.string().regex(/^\d{6}$/), referredBy: z.string().trim().max(32).optional() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: valid, error: verifyError } = await supabaseAdmin.rpc('verify_otp_challenge', { p_phone: data.phone, p_otp: data.otp });
    if (verifyError || !valid) return { ok: false as const, message: 'Invalid or expired OTP.' };
    const { error } = await supabaseAdmin.auth.admin.createUser({ email: `${data.phone}@hkwallet.app`, password: data.password, email_confirm: true, user_metadata: { phone: data.phone, name: data.phone, referred_by: data.referredBy?.toUpperCase() ?? '' } });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });