import { PWA_BASE_URL } from './brand';

export function linkToStamp(zone: string, guestId?: string, source: 'nfc' | 'web' = 'web') {
  const url = new URL(`${PWA_BASE_URL}/stamp/${encodeURIComponent(zone)}`);
  
  // Add query parameters directly instead of JWT
  url.searchParams.set('source', source);
  if (guestId) url.searchParams.set('guest_id', guestId);
  
  return url.toString();
}

export function linkToDashboard(utm?: Record<string, string>) {
  const url = new URL(`${PWA_BASE_URL}/dashboard`);
  Object.entries(utm || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

export function linkToRewards(flow?: string) {
  const url = new URL(`${PWA_BASE_URL}/rewards`);
  if (flow) url.searchParams.set('flow', flow);
  return url.toString();
}

export function trackZoneClick(zone: string) {
  // Track zone CTA clicks
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'zone_cta_click', { zone });
  }
}