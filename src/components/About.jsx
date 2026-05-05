import { aboutHero, aboutTimeline, aboutValues } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function About() {
  return (
    <section id="about">
      <header className="st-about-hero">
        <div className="st-about-hero-bg" aria-hidden="true">
          <img alt="" decoding="async" src={aboutHero.image} />
        </div>
        <div className="st-about-gradient" />
        <div className="st-container st-about-inner" style={{ alignSelf: 'center', width: '100%' }}>
          <p
            className="stat-label-about"
            style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', fontFamily: 'var(--font-head)' }}
          >
            {aboutHero.eyebrow}
          </p>
          <h2 className="st-display" style={{ color: 'var(--on-background)', marginBottom: '1.5rem' }}>
            Архитектура
            <br />
            будущего
          </h2>
          <p className="st-text-muted" style={{ fontSize: '1.125rem', maxWidth: '32rem', marginBottom: '2.5rem' }}>
            {aboutHero.lead}
          </p>
          <div className="st-metrics-row-about">
            {aboutHero.metrics.map((m, i) => (
              <div key={m.label} style={{ display: 'contents' }}>
                {i > 0 ? <span className="stat-sep" aria-hidden="true" /> : null}
                <div>
                  <span className="st-stat-num">{m.value}</span>
                  <span className="stat-label-about" style={{ display: 'block', marginTop: '0.35rem', fontFamily: 'Inter, sans-serif' }}>
                    {m.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="st-timeline-section">
        <div className="st-container" style={{ position: 'relative' }}>
          <div className="st-timeline-line" />
          <h2 className="st-display-sm" style={{ marginBottom: '1rem', fontFamily: 'var(--font-head)' }}>
            {aboutTimeline.title}
          </h2>
          <div className="steel-gradient st-divider-accent" style={{ margin: '0 0 2.5rem', width: '6rem', height: '4px', marginLeft: 0 }} />
          <div className="st-timeline-grid">
            {aboutTimeline.items.map((it) => (
              <div className="st-timeline-item" key={it.year}>
                <div className="st-timeline-year">{it.year}</div>
                <div className="st-timeline-body">
                  <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem', color: 'var(--on-background)' }}>{it.title}</h3>
                  <p className="st-text-muted" style={{ fontSize: '0.8125rem' }}>
                    {it.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="st-container st-values-grid">
        <div className="st-values-layout">
          <div>
            <h2 className="st-display-sm" style={{ fontFamily: 'var(--font-head)', marginBottom: '2rem', lineHeight: 1.1 }}>
              {aboutValues.title}
            </h2>
            <p className="st-text-muted" style={{ fontSize: '1.0625rem' }}>
              {aboutValues.lead}
            </p>
          </div>
          <div className="st-value-cards">
            {aboutValues.cards.map((c) => {
              const skin = { light: 'bright', high: 'high', accent: 'accent' }[c.variant] || 'bright';
              return (
              <article
                key={c.title}
                className={`st-value-card st-value-card--${skin}`.trim()}
              >
                <MaterialIcon name={c.icon} filled={c.filled} style={{ fontSize: '2rem', marginBottom: '1.25rem', color: c.variant === 'accent' ? '#fff' : 'var(--primary)' }} />
                <h3 className="domain-label" style={{ fontSize: '1.375rem', marginBottom: '0.85rem', color: 'inherit', letterSpacing: '0.12em', fontFamily: 'var(--font-head)' }}>
                  {c.title}
                </h3>
                <p className={c.variant === 'accent' ? undefined : 'st-text-muted'} style={{ fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
                  {c.body}
                </p>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
