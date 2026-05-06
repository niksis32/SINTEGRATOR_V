/**
 * Публичный origin сайта без завершающего слэша.
 * Задаётся в `.env`: VITE_SITE_ORIGIN=https://www.ваш-домен.ru
 */
export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_ORIGIN || 'https://sintegrator.ru'
).replace(/\/$/, '');

export function absoluteUrl(pathname) {
  if (!pathname || pathname === '/') {
    return `${SITE_ORIGIN}/`;
  }
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${p}`;
}
