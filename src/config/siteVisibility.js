/**
 * Управление видимостью для поисковых систем и режимом «сайт в разработке».
 *
 * VITE_BLOCK_SEARCH_ROBOTS — закрыть сайт от роботов при сборке/запуске:
 *   true  → meta robots noindex,nofollow + robots.txt Disallow: /
 *   false → обычные правила из seoConfig и публичный robots.txt
 *
 * VITE_MAINTENANCE_MODE — показывать экран заглушки всем посетителям.
 * VITE_MAINTENANCE_ACCESS_CODE — код доступа (после ввода сайт открывается в этой сессии браузера).
 */

export const blockSearchRobots = import.meta.env.VITE_BLOCK_SEARCH_ROBOTS === 'true';

export const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

export const maintenanceAccessCode = String(
  import.meta.env.VITE_MAINTENANCE_ACCESS_CODE || '',
).trim();

const BYPASS_KEY = 'sintegrator.maintenanceBypass';

export function hasMaintenanceBypass() {
  try {
    return sessionStorage.getItem(BYPASS_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMaintenanceBypass() {
  try {
    sessionStorage.setItem(BYPASS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function clearMaintenanceBypass() {
  try {
    sessionStorage.removeItem(BYPASS_KEY);
  } catch {
    /* ignore */
  }
}
