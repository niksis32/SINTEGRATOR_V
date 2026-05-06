import { useEffect, useState } from 'react';
import { NavLink, Link, useSearchParams } from 'react-router-dom';
import { useSiteData } from '../data/siteData.js';
import { usePreferences } from '../contexts/PreferencesContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import MaterialIcon from './MaterialIcon.jsx';
import AuthModal from './AuthModal.jsx';

export default function Header() {
  const { navRoutes } = useSiteData();
  const { lang, theme, toggleLang, toggleTheme } = usePreferences();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  useEffect(() => {
    if (searchParams.get('login') !== '1') return;
    setAuthTab('login');
    setAuthOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('login');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

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
          <div className="st-nav-icon-group">
            <button
              type="button"
              className="st-icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Enable dark theme' : 'Включить светлую тему'}
              title={theme === 'light' ? 'Dark' : 'Light'}
            >
              <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} filled />
            </button>
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
            <div className="st-nav-auth-slot" key={user ? user.email : 'guest'}>
              {user ? (
                <div className="st-nav-auth-cluster">
                  <span className="st-auth-user" title={user.email}>
                    <MaterialIcon name="person" />
                    <span className="st-auth-user-name">{user.name}</span>
                  </span>
                  <button
                    type="button"
                    className="st-icon-btn"
                    onClick={logout}
                    aria-label={lang === 'ru' ? 'Выйти' : 'Log out'}
                    title={lang === 'ru' ? 'Выйти' : 'Log out'}
                  >
                    <MaterialIcon name="logout" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="st-icon-btn"
                  onClick={() => {
                    setAuthTab('login');
                    window.setTimeout(() => setAuthOpen(true), 95);
                  }}
                  aria-label={lang === 'ru' ? 'Вход и регистрация' : 'Sign in or register'}
                  title={lang === 'ru' ? 'Вход / Регистрация' : 'Sign in / Register'}
                >
                  <MaterialIcon name="person" />
                </button>
              )}
            </div>
          </div>
          <Link className="st-btn-head steel-gradient" to="/contacts">
            {lang === 'ru' ? 'Обсудить проект' : 'Discuss project'}
          </Link>
        </div>
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
    </header>
  );
}
