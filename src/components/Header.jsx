import { navItems } from '../data/siteData.js';

export default function Header() {
  return (
    <header className="st-header">
      <nav className="st-nav" aria-label="Основное меню">
        <a className="st-logo" href="#home">
          Синтегратор
        </a>
        <div className="st-nav-links">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              className={`st-nav-link ${i === 1 ? 'st-nav-link--active' : ''}`.trim()}
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a className="st-btn-head steel-gradient" href="#contacts">
          Discuss Project
        </a>
      </nav>
    </header>
  );
}
