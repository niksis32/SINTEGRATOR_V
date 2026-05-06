import { NavLink, Link } from 'react-router-dom';
import { useSiteData } from '../data/siteData.js';
import { usePreferences } from '../contexts/PreferencesContext.jsx';
import MaterialIcon from './MaterialIcon.jsx';

export default function Header() {
  const { navRoutes } = useSiteData();
  const { lang, theme, toggleLang, toggleTheme } = usePreferences();
  return (
    <header className="st-header">
      <nav className="st-nav" aria-label="Основное меню">
        <Link className="st-logo st-logo--en-wordmark" to="/">
          SINTEGRATOR
        </Link>
        <div className="st-nav-links">
          {navRoutes.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => `st-nav-link${isActive ? ' st-nav-link--active' : ''}`.trim()}
              to={item.path}
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="st-nav-actions">
          <button
            type="button"
            className="st-icon-btn"
            onClick={toggleLang}
            aria-label={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
            title={lang === 'ru' ? 'EN' : 'RU'}
          >
            <MaterialIcon name="language" />
            <span className="st-icon-btn-text">{lang === 'ru' ? 'EN' : 'RU'}</span>
          </button>
          <button
            type="button"
            className="st-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Enable dark theme' : 'Включить светлую тему'}
            title={theme === 'light' ? 'Dark' : 'Light'}
          >
            <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} filled />
          </button>
          <Link className="st-btn-head steel-gradient" to="/contacts">
            {lang === 'ru' ? 'Обсудить проект' : 'Discuss project'}
          </Link>
        </div>
      </nav>
    </header>
  );
}
