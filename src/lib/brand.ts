/**
 * Single source of truth for brand assets and download links.
 *
 * The app logo is served from the /public directory so it renders reliably
 * in production builds without depending on storage bucket configuration.
 * Place the logo at public/brand/logo.png.
 */
export const APP_NAME = 'Hkwallet';
export const APP_TAGLINE = 'Earn Money Online';

/** Absolute public path to the app logo (public/brand/logo.png). */
export const APP_LOGO = '/brand/logo.png';

/** Place the signed build at public/downloads/hkwallet.apk */
export const APK_URL = '/downloads/hkwallet.apk';

export const SITE_ORIGIN = 'https://hkwallet.site';
/** Canonical single-domain invite link: https://hkwallet.site/<code>/register */
export const referralLink = (code: string) =>
  `${SITE_ORIGIN}/${encodeURIComponent(code.trim().toUpperCase())}/register`;

/** Referral rebate levels shown across the app. */
export const REBATE_LEVELS = [
  { name: 'Level 1', rate: '5%' },
  { name: 'Level 2', rate: '0.3%' },
  { name: 'Level 3', rate: '0.1%' },
];

/** Default referral commission for a normal user, in percent. */
export const DEFAULT_COMMISSION_PERCENT = 5;
