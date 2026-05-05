import { footer } from '../data/siteData.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="st-footer">
      <div className="st-footer-grid st-container">
        <div>
          <div className="st-logo" style={{ marginBottom: '1.75rem' }}>
            Синтегратор
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>{footer.description}</p>
        </div>
        <div>
          <h5>Услуги</h5>
          <ul className="st-footer-list">
            {footer.services.map((s) => (
              <li key={s}>
                <a href="#services">{s}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Компания</h5>
          <ul className="st-footer-list">
            {footer.company.map((s) => (
              <li key={s}>
                <a href={`#${s === 'О компании' ? 'about' : s === 'Кейсы' ? 'cases' : 'contacts'}`}>{s}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Юридическая информация</h5>
          <ul className="st-footer-list">
            {footer.legal.map((s) => (
              <li key={s}>
                <a href="#contacts">{s}</a>
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
          <a href="#contacts">LinkedIn</a>
          <a href="#contacts">Telegram</a>
        </div>
      </div>
    </footer>
  );
}
