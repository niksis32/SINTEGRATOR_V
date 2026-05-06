import { useSiteData } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function Testimonials() {
  const { testimonials } = useSiteData();
  return (
    <section className="st-testimonials">
      <div className="micro-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1920, marginInline: 'auto', paddingInline: 'clamp(1.25rem, 4vw, 3rem)' }}>
        <div className="st-testimonials-head">
          <span className="domain-label" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--primary)', letterSpacing: '0.35em', fontFamily: 'var(--font-head)' }}>
            {testimonials.eyebrow}
          </span>
          <h2 className="st-display st-display-sm" style={{ letterSpacing: '-0.035em', marginBottom: '1rem' }}>
            {testimonials.title}
          </h2>
          <div className="st-divider-accent steel-gradient" style={{ margin: '0 auto' }} />
        </div>
        <div className="st-quote-grid">
          {testimonials.items.map((t) => (
            <article key={t.name} className="st-quote-card milled-surface monolith-shadow">
              <MaterialIcon name="format_quote" className="st-quote-mark" />
              <blockquote className="st-quote-text">«{t.quote}»</blockquote>
              <div className="st-quote-meta">
                <div className="st-avatar-mini">
                  <MaterialIcon name="person" />
                </div>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.name}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--outline)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
