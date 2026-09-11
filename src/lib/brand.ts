import { getLogoUrl } from './storage';

/**
 * Single source of truth for brand assets and download links.
 *
 * The logo comes from the SAME source the admin panel uses:
 * the `logos` storage bucket, file `Vivrapaylogo.png`.
 * Replace that file in storage and it updates everywhere (admin + user side).
 */
export const APP_NAME = 'Hkwallet';
export const APP_TAGLINE = 'Earn Money Online';

/** Same connection/source as the admin panel logo. */
export const APP_LOGO = getLogoUrl('Vivrapaylogo.png');

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
