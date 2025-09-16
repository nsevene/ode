import { PWA_BASE_URL } from './brand';

export function linkToStamp(zone: string, guestId?: string, source: 'nfc'|'web'='web') {
  const u = new URL(`${PWA_BASE_URL}/stamp/${encodeURIComponent(zone)}`);
  if (guestId) u.searchParams.set('guest_id', guestId);
  u.searchParams.set('source', source);
  return u.toString();
}

export function linkToDashboard(utm?: Record<string,string>) {
  const u = new URL(`${PWA_BASE_URL}/dashboard`);
  Object.entries(utm||{}).forEach(([k,v])=>u.searchParams.set(k,v));
  return u.toString();
}

export function linkToRewards(flow?: string) {
  const u = new URL(`${PWA_BASE_URL}/rewards`);
  if (flow) u.searchParams.set('flow', flow);
  return u.toString();
}

export function linkToZone(zone: string) {
  return `/zones/${zone}`;
}