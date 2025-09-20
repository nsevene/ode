export const BRAND_CANON = 'Ode food hall Gastro village Ubud';
export const BRAND_CANON_HOST =
  import.meta.env.VITE_CANON_HOST || 'odefoodhall.com';
export const PWA_BASE_URL =
  import.meta.env.VITE_PWA_BASE_URL || 'https://app.odefoodhall.com';

export const ZONES = [
  'ferment',
  'smoke',
  'spice',
  'umami',
  'sweet-salt',
  'sour-herb',
  'zero-waste',
] as const;

export type Zone = (typeof ZONES)[number];
