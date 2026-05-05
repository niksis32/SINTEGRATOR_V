import { caseIndustrial, caseLogistics, casesHero } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function Cases() {
  return (
    <section id="cases">
      <div className="st-container st-cases-hero">
        <div>
          <span className="st-eyebrow">{casesHero.eyebrow}</span>
          <h2 className="st-display">
            {casesHero.title} <br />
            <span className="st-title-accent">{casesHero.accent}</span> <br />
            {casesHero.titleLine2}
          </h2>
          <p className="st-text-muted" style={{ fontSize: '1.25rem', maxWidth: '36rem' }}>
            {casesHero.lead}
          </p>
        </div>
        <div className="st-cases-metrics">
          {casesHero.stats.map((s) => (
            <div key={s.label} className="milled-surface st-metric-milled monolith-shadow">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="st-container st-case-grid-wrap">
        {/* Row 1: industrial */}
        <div className="st-case-row" style={{ borderBottom: '1px solid rgba(197, 198, 204, 0.3)' }}>
          <div className="st-case-row-half" style={{ padding: clampPad() }}>
            <div className="domain-icon-wrap">
              <div className="icon-box glass-panel monolith-shadow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem' }}>
                <MaterialIcon name="precision_manufacturing" filled style={{ fontSize: '2rem', color: 'var(--primary)' }} />
              </div>
              <span className="domain-label">{caseIndustrial.label}</span>
            </div>
            <h3 className="st-display-sm" style={{ fontFamily: 'var(--font-head)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {caseIndustrial.title}
            </h3>
            <p className="st-text-muted" style={{ fontSize: '1.0625rem', maxWidth: '36rem', marginBottom: '2rem' }}>
              {caseIndustrial.body}
            </p>
            <div className="st-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {caseIndustrial.metrics.map((m) => (
                <div key={m.label}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{m.value}</div>
                  <div className="st-kpi-suffix">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="st-case-row-half st-inverse-panel" style={{ position: 'relative', minHeight: '360px', overflow: 'hidden' }}>
            <div className="micro-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
            <img alt="" className="st-media-bg" style={{ opacity: 0.35, mixBlendMode: 'overlay' }} src={caseIndustrial.image} />
            <div style={{ position: 'relative', zIndex: 2, padding: '4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px' }}>
              <div className="st-hud-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.5625rem', fontFamily: 'ui-monospace, monospace', color: 'rgb(84 95 115 / 0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Layer_01_Core_Structure
                  </span>
                  <MaterialIcon name="hub" style={{ fontSize: '1rem', color: 'rgb(84 95 115 / 0.35)' }} />
                </div>
                <div style={{ aspectRatio: '16/9', background: 'rgb(248 249 255 / 0.25)', border: '1px solid rgb(84 95 115 / 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-head)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#fff', padding: '0.5rem 1rem', border: '1px solid rgba(197, 198, 204, 0.35)', boxShadow: '0 12px 40px rgba(13,28,46,0.12)' }}>
                    System Topology Map
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <div style={{ height: '2px', background: 'var(--primary)', width: '25%' }} />
                  <div style={{ height: '2px', background: 'rgb(84 95 115 / 0.12)', flex: 1 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: logistics */}
        <div className="st-case-row">
          <div className="st-case-row-half" style={{ position: 'relative', minHeight: '320px', overflow: 'hidden', background: 'var(--surface-container-highest)' }}>
            <img alt="" className="st-media-bg" style={{ filter: 'grayscale(1)' }} src={caseLogistics.image} />
            <div style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0, paddingInline: '2rem', zIndex: 3 }}>
              <div style={{ background: 'rgb(255 255 255 / 0.95)', backdropFilter: 'blur(8px)', padding: '2rem', boxShadow: '0 30px 60px rgba(13,28,46,0.12)', borderTop: '2px solid var(--primary)' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.75rem', fontWeight: 700, color: 'var(--on-background)', marginBottom: '0.35rem' }}>{caseLogistics.stat.value}</div>
                <p className="domain-label" style={{ margin: 0 }}>
                  {caseLogistics.stat.label}
                </p>
              </div>
            </div>
          </div>
          <div className="st-case-row-half" style={{ padding: clampPad() }}>
            <div className="domain-icon-wrap">
              <div className="icon-box glass-panel monolith-shadow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem' }}>
                <MaterialIcon name="hub" filled style={{ fontSize: '2rem', color: 'var(--primary)' }} />
              </div>
              <span className="domain-label">{caseLogistics.label}</span>
            </div>
            <h3 className="st-display-sm" style={{ fontFamily: 'var(--font-head)', marginBottom: '1.5rem', maxWidth: '32rem' }}>
              {caseLogistics.title}
            </h3>
            <p className="st-text-muted" style={{ fontSize: '1.0625rem', marginBottom: '2rem', maxWidth: '36rem' }}>
              {caseLogistics.body}
            </p>
            <div className="st-log-row">
              <div className="st-log-card milled-surface">
                <h4 className="domain-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  <MaterialIcon name="history" style={{ fontSize: '0.875rem' }} /> Legacy Phase
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: 'var(--secondary)' }}>
                  {caseLogistics.legacyItems.map((t) => (
                    <li key={t} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="st-log-dot" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="st-log-card st-log-card-inverse">
                <h4 className="domain-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem', color: 'var(--primary-container)' }}>
                  <MaterialIcon name="rocket_launch" style={{ fontSize: '0.875rem' }} /> Synthetized Phase
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {caseLogistics.synthItems.map((t) => (
                    <li key={t} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="st-log-dot" style={{ background: 'var(--primary-container)' }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(197, 198, 204, 0.2)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <a className="st-link-arrow" href="#contacts" style={{ color: 'var(--primary)' }}>
                ENGINEERING VIEW <MaterialIcon name="arrow_right_alt" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function clampPad() {
  return 'clamp(2rem, 5vw, 4rem)';
}
