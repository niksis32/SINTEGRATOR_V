import { NavLink, Link } from 'react-router-dom';
import { navRoutes } from '../data/siteData.js';

export default function Header() {
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
        <Link className="st-btn-head steel-gradient" to="/contacts">
          Discuss Project
        </Link>
      </nav>
    </header>
  );
}
