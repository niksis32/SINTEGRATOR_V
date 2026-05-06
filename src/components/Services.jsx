import { Link } from 'react-router-dom';
import { useSiteData } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

function BentoCard(item) {
  if (item.variant === 'inverse') {
    return (
      <div className={`st-b-span-4 st-service-card-inverse st-card-pad-xl ${item.span === 'small' ? '' : ''}`.trim()}>
        <div>
          <MaterialIcon name={item.icon} className="" style={{ fontSize: '2.5rem', color: '#bcc7de', marginBottom: '2rem' }} />
          <h3 className="st-card-title" style={{ fontSize: '1.75rem', color: '#fff' }}>
            {item.title}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.body}</p>
        </div>
        <Link className="st-link-arrow" to="/cases" style={{ color: '#fff', marginTop: '2.5rem' }}>
          {item.link} <MaterialIcon name="arrow_forward" />
        </Link>
      </div>
    );
  }

  if (item.variant === 'media') {
    return (
      <div className="st-b-span-8 st-media-banner">
        <img alt="" className="st-media-bg" src={item.bgImage} />
        <div className="st-media-overlay" aria-hidden />
        <div className="st-card-pad-xl">
          <h3 className="st-card-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.125rem)', color: '#fff', fontFamily: 'var(--font-head)' }}>
            {item.title}
          </h3>
          <p className="st-text-muted" style={{ fontSize: '1.0625rem', color: '#e2e8f0', maxWidth: '30rem', marginBottom: '2rem' }}>
            {item.body}
          </p>
          <div className="st-stat-inline">
            {item.stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary-container)' }}>
                  {s.value}
                </div>
                <div className="st-kpi-suffix" style={{ color: '#cbd5e1' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* milled */
  return (
    <div className={`${item.span === 'large' ? 'st-b-span-8' : 'st-b-span-4'}`}>
      <div className="milled-surface st-card-pad-xl" style={{ height: '100%', transition: 'transform 0.35s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <MaterialIcon name={item.icon} filled={item.iconFilled} style={{ fontSize: '2.75rem', color: 'var(--primary)' }} />
          {item.index && (
            <span className="domain-label" style={{ marginTop: '0.35rem', letterSpacing: '0.08em', fontWeight: 800 }}>
              {item.index}
            </span>
          )}
        </div>
        <h3 className="st-card-title" style={{ fontSize: item.span === 'large' ? '2rem' : '1.375rem', fontFamily: 'var(--font-head)' }}>
          {item.title}
        </h3>
        <p className="st-text-muted" style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: '40rem', lineHeight: 1.7 }}>
          {item.body}
        </p>
        {item.meta && (
          <div className="st-kpi-grid" style={{ borderTopColor: 'rgba(197, 198, 204, 0.2)' }}>
            {item.meta.map((m) => (
              <div key={m.label}>
                <p className="st-kpi-label">{m.label}</p>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: 'var(--on-background)' }}>{m.value}</p>
              </div>
            ))}
          </div>
        )}
        {item.chips && (
          <div className="chip-row">
            {item.chips.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Services() {
  const { architectureBlueprint, servicesBento, servicesHero } = useSiteData();
  return (
    <section id="services">
      <div className="st-container st-services-hero">
        <div className="st-services-grid-hero">
          <div>
            <span className="st-eyebrow">{servicesHero.eyebrow}</span>
            <h2 className="st-display">
              {servicesHero.title}
              <br />
              <span className="st-title-accent">{servicesHero.titleAccent}</span>
            </h2>
            <p className="st-text-muted" style={{ fontSize: '1.25rem', maxWidth: '36rem' }}>
              {servicesHero.lead}
            </p>
          </div>
          <div className="st-hero-media-wrap">
            <div className="st-media-back monolith-shadow" aria-hidden />
            <img alt="" className="st-media-img monolith-shadow" src={servicesHero.heroImage} />
            <div className="st-uptime-card monolith-shadow">
              <strong>{servicesHero.uptime}</strong>
              <span className="st-kpi-suffix" style={{ display: 'block', marginTop: '0.25rem' }}>
                {servicesHero.uptimeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="st-container st-bento-grid">{servicesBento.map((item) => <BentoCard key={item.title} {...item} />)}</div>

      <div className="st-blueprint-section">
        <div className="st-blueprint-head">
          <span className="st-eyebrow" style={{ marginBottom: '1rem' }}>
            {architectureBlueprint.eyebrow}
          </span>
          <h2 className="st-display st-display-sm" style={{ textAlign: 'center' }}>
            {architectureBlueprint.title}
          </h2>
        </div>
        <div
          className="st-blueprint-shell"
          onMouseMove={(e) => {
            const el = e.currentTarget;
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            el.style.setProperty('--mx', `${(x - 0.5).toFixed(4)}`);
            el.style.setProperty('--my', `${(y - 0.5).toFixed(4)}`);
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.setProperty('--mx', '0');
            el.style.setProperty('--my', '0');
          }}
        >
          <div className="st-schema">
            {architectureBlueprint.columns.map((col) => (
              <div
                className={`st-schema-card ${col.highlight ? 'st-schema-mid' : ''}`.trim()}
                data-highlight={col.highlight ? '1' : '0'}
                key={col.title}
              >
                <div className={col.highlight ? 'st-schema-ring st-schema-ring--grad' : 'st-schema-ring'}>
                  <MaterialIcon name={col.icon} style={{ fontSize: '1.75rem' }} filled={col.highlight} />
                </div>
                <h4 className="domain-label" style={{ marginBottom: '0.75rem', letterSpacing: '0.12em' }}>
                  {col.title}
                </h4>
                <p className="st-text-muted" style={{ fontSize: '0.75rem' }}>
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
