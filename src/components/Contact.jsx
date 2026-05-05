import { contactPage } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function Contact() {
  return (
    <section id="contacts" className="st-contact-main st-container">
      <div className="st-contact-intro" style={{ paddingTop: 'clamp(1rem, 3vw, 2rem)' }}>
        <div>
          <h2 className="st-display chrome-text" style={{ whiteSpace: 'pre-line', marginBottom: '1.75rem' }}>
            {contactPage.title}
          </h2>
          <p className="st-text-muted" style={{ fontSize: '1.125rem', maxWidth: '38rem' }}>
            {contactPage.lead}
          </p>
        </div>
        <div className="st-divider-accent" style={{ background: 'rgba(197, 198, 204, 0.35)', height: 1, alignSelf: 'end', width: '100%', marginBottom: '2rem', display: 'none' }} aria-hidden />
      </div>

      <div className="st-contact-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2.25rem', border: '1px solid rgb(255 255 255 / 0.4)', boxShadow: '0 8px 28px rgba(13,28,46,0.06)', display: 'flex', flexDirection: 'column', gap: '0' }}>
            <ContactLine icon="call" label="Телефон" value={contactPage.phone} />
            <ContactLine icon="mail" label="Электронная почта" value={contactPage.email} />
            <ContactLine icon="location_on" label="Центральный офис" value={contactPage.address} isLast />
          </div>
          <div style={{ background: 'var(--surface-container-low)', padding: '2.25rem', border: '1px solid rgba(197, 198, 204, 0.14)' }}>
            <h3 className="domain-label" style={{ letterSpacing: '0.15em', marginBottom: '1.75rem', fontSize: '0.875rem' }}>
              Локации
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {contactPage.locations.map((loc) => (
                <div key={loc.city}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', margin: '0 0 0.25rem', color: 'var(--on-background)' }}>{loc.city}</h4>
                  <p className="st-text-muted" style={{ margin: 0, fontSize: '0.8125rem' }}>
                    {loc.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ background: 'var(--surface-container-lowest)', padding: 'clamp(2rem, 6vw, 5rem)', border: 'none', boxShadow: '0 25px 65px rgba(13,28,46,0.1)', position: 'relative', overflow: 'hidden' }}>
          <div className="steel-gradient" style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '16rem', height: '16rem', borderRadius: '50%', opacity: 0.05, filter: 'blur(48px)' }} aria-hidden />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 className="st-display-sm" style={{ fontFamily: 'var(--font-head)', marginBottom: '2.5rem' }}>
              {contactPage.formTitle}
            </h3>
            <form className="st-form-grid" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="st-field-label" htmlFor="name">
                  Ваше имя
                </label>
                <input className="st-input" id="name" name="name" type="text" placeholder="Алексей Иванов" autoComplete="name" />
              </div>
              <div>
                <label className="st-field-label" htmlFor="email">
                  Email адрес
                </label>
                <input className="st-input" id="email" name="email" type="email" placeholder="email@company.com" autoComplete="email" />
              </div>
              <div>
                <label className="st-field-label" htmlFor="company">
                  Компания
                </label>
                <input className="st-input" id="company" name="company" type="text" placeholder="Global Systems" />
              </div>
              <div>
                <label className="st-field-label" htmlFor="sector">
                  Отрасль
                </label>
                <select className="st-select" id="sector" name="sector" defaultValue="Производство">
                  {['Финтех', 'Производство', 'Логистика', 'Retail'].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="st-form-span-2">
                <label className="st-field-label" htmlFor="message">
                  Ваше сообщение
                </label>
                <textarea className="st-textarea" id="message" name="message" rows={5} placeholder="Опишите ваши задачи и цели..." />
              </div>
              <div className="st-form-span-2 st-form-footer">
                <label className="st-checkbox-row" htmlFor="terms">
                  <input id="terms" name="terms" type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                  Согласен на обработку персональных данных
                </label>
                <button className="st-btn-head steel-gradient monolith-shadow" style={{ letterSpacing: '0.08em', width: '100%', maxWidth: '18rem', justifySelf: 'end', borderRadius: '0.125rem' }} type="submit">
                  Отправить запрос
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <MapBlock />
    </section>
  );
}

function ContactLine({ icon, label, value, isLast }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: isLast ? 0 : '2.25rem' }}>
      <div className="st-schema-ring" style={{ width: '3.35rem', height: '3.35rem', background: 'var(--surface-container-highest)', flexShrink: 0 }}>
        <MaterialIcon name={icon} style={{ fontSize: '1.65rem', color: 'var(--primary)' }} />
      </div>
      <div>
        <p className="domain-label" style={{ margin: '0 0 0.2rem', fontSize: '0.625rem' }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

function MapBlock() {
  return (
    <div style={{ marginTop: 'clamp(3rem, 8vw, 5rem)' }}>
      <div className="map-section">
        <img alt="" src={contactPage.mapImage} />
        <div className="map-overlay" />
        <div className="map-badge">
          <h4>Метка на карте</h4>
          <p>Нажмите для построения маршрута</p>
        </div>
        <div className="map-marker-wrap">
          <div className="map-pulse" />
          <div className="map-dot-ring" />
          <div className="map-dot-core" />
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button type="button" className="map-ctrl-btn" aria-label="Увеличить">
            <MaterialIcon name="add" style={{ color: '#fff', fontSize: '1.25rem' }} />
          </button>
          <button type="button" className="map-ctrl-btn" aria-label="Уменьшить">
            <MaterialIcon name="remove" style={{ color: '#fff', fontSize: '1.25rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
