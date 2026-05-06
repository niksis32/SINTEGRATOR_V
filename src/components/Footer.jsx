import { Link } from 'react-router-dom';
import { footer } from '../data/siteData.js';

const companyPaths = {
  'О компании': '/about',
  Кейсы: '/cases',
  Контакты: '/contacts',
  Карьера: '/contacts',
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="st-footer">
      <div className="st-footer-grid st-container">
        <div>
          <Link className="st-logo" to="/" style={{ marginBottom: '1.75rem', display: 'inline-block' }}>
            Синтегратор
          </Link>
          <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>{footer.description}</p>
        </div>
        <div>
          <h5>Услуги</h5>
          <ul className="st-footer-list">
            {footer.services.map((s) => (
              <li key={s}>
                <Link to="/services">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Компания</h5>
          <ul className="st-footer-list">
            {footer.company.map((s) => (
              <li key={s}>
                <Link to={companyPaths[s] || '/'}>{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Юридическая информация</h5>
          <ul className="st-footer-list">
            {footer.legal.map((s) => (
              <li key={s}>
                <Link to="/contacts">{s}</Link>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '1.5rem' }}>{footer.address}</p>
          <p className="st-footer-phone">{footer.phone}</p>
        </div>
      </div>
      <div className="st-footer-bottom">
        <div>© {year} Синтегратор. Все права защищены.</div>
        <div className="st-footer-soc">
          <Link to="/contacts">LinkedIn</Link>
          <Link to="/contacts">Telegram</Link>
        </div>
      </div>
    </footer>
  );
}
