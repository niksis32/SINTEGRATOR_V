import { Link } from 'react-router-dom';
import { useSiteData } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function HomeLanding() {
  const { homePage } = useSiteData();
  const { hero, spheres, chaos, serviceModules, keyOffer, portfolio, protocol, closing } = homePage;
  return (
    <div className="st-home-root architectural-grid">
      <section className="st-home-hero-full">
        <div className="st-home-hero-bg-wrap" aria-hidden="true">
          <div className="st-home-hero-gradient" />
          <img alt="" className="st-home-hero-photo" src={hero.bgImage} />
        </div>
        <div className="st-container st-home-hero-content">
          <div className="st-home-eyebrow-bar">
            <span className="st-home-eyebrow-inner">{hero.eyebrow}</span>
          </div>
          <h1 className="st-home-mega-title">{hero.title}</h1>
          <p className="st-home-lead">{hero.lead}</p>
          <div className="st-home-hero-actions">
            <Link className="st-btn-head steel-gradient st-home-btn-pad" to="/contacts">
              {hero.primaryCta}
            </Link>
            <Link className="st-btn-secondary-home" to="/services">
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="st-container st-home-section">
        <div className="st-home-spheres-head">
          <div>
            <h2 className="st-display-sm st-home-h2-upper">{spheres.title}</h2>
            <p className="st-text-muted st-home-sub">{spheres.lead}</p>
          </div>
          <div className="st-home-rule" aria-hidden />
        </div>
        <div className="st-home-sphere-grid">
          {spheres.cards.map((c) => (
            <article key={c.title} className="st-home-sphere-card">
              <img alt={c.alt} className="st-home-sphere-img" src={c.image} />
              <div className="st-home-sphere-overlay" />
              <div className="st-home-sphere-caption">
                <span className="st-home-sphere-tag">{c.tag}</span>
                <h3 className="st-home-sphere-title">{c.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="st-home-chaos">
        <div className="st-container st-home-chaos-grid">
          <div className="st-home-chaos-visual">
            <div className="st-home-chaos-frame">
              <img alt="" src={chaos.image} />
              <div className="st-home-chaos-chips">
                {chaos.chips.map((ch) => (
                  <div key={ch.label} className="st-home-chip">
                    <span className="st-home-chip-label">{ch.label}</span>
                    <p>{ch.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="st-display-sm" style={{ marginBottom: '2.5rem', lineHeight: 1.1 }}>
              {chaos.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {chaos.steps.map((s) => (
                <div key={s.num} className="st-home-chaos-step">
                  <span className="st-home-chaos-num">{s.num}</span>
                  <div>
                    <h4 className="st-home-chaos-step-title">{s.title}</h4>
                    <p className="st-text-muted" style={{ margin: 0 }}>
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="st-container st-home-section">
        <h2 className="st-display-sm st-home-modules-title">{serviceModules.title}</h2>
        <div className="st-home-modules-grid">
          {serviceModules.cards.map((c) => (
            <div key={c.title} className="st-home-module-card">
              <div className="st-home-module-thumb">
                <img alt="" src={c.image} />
              </div>
              <h3 className="st-home-module-h">{c.title}</h3>
              <p className="st-text-muted st-home-module-p">{c.body}</p>
              <div className="st-home-module-bar" aria-hidden />
            </div>
          ))}
        </div>
      </section>

      <section className="st-home-keyoffer">
        <div className="st-home-keyoffer-bg" aria-hidden="true">
          <img alt="" src={keyOffer.bgImage} />
        </div>
        <div className="st-container st-home-keyoffer-inner">
          <div className="st-home-keyoffer-copy">
            <h2 className="st-home-keyoffer-title">
              {keyOffer.titleLine1} <br />
              <span className="st-title-accent">{keyOffer.titleAccent}</span>
            </h2>
            <p className="st-home-keyoffer-lead">{keyOffer.lead}</p>
            <Link className="st-btn-dark-lg" to="/contacts">
              {keyOffer.cta}
            </Link>
          </div>
          <div className="st-home-keyoffer-deco" aria-hidden="true">
            <div className="st-home-keyoffer-frame">
              <div className="st-home-keyoffer-iconbox">
                <MaterialIcon name="verified_user" filled style={{ fontSize: '6rem', color: 'var(--primary-fixed-dim, #bcc7de)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="st-container st-home-section">
        <div className="st-home-port-head">
          <h2 className="st-display-sm st-home-h2-upper">{portfolio.title}</h2>
          <p className="st-text-muted st-home-port-lead">{portfolio.lead}</p>
        </div>
        <div className="st-home-port-grid">
          {portfolio.items.map((p) => (
            <Link key={p.title} to="/cases" className="st-home-port-card">
              <div className="st-home-port-imgwrap">
                <img alt="" src={p.image} />
                <div className="st-home-port-imgshade" />
              </div>
              <span className="domain-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                {p.sector}
              </span>
              <h3 className="st-home-port-ht">{p.title}</h3>
              <p className="st-text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>
                {p.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="st-home-protocol">
        <div className="st-container">
          <h2 className="st-display-sm st-home-protocol-title">{protocol.title}</h2>
          <div className="st-home-protocol-line" aria-hidden />
          <div className="st-home-protocol-grid">
            {protocol.steps.map((s) => (
              <div key={s.title} className="st-home-protocol-step">
                <div className="icon-3d-wrapper">
                  <div className="icon-3d-box">
                    <MaterialIcon name={s.icon} className="" style={{ fontSize: '2.25rem' }} />
                  </div>
                </div>
                <h4 className="st-home-protocol-h">{s.title}</h4>
                <p className="st-text-muted st-home-protocol-p">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="st-container st-home-closing">
        <div className="st-home-closing-inner">
          <h2 className="st-home-closing-title">
            {closing.titleLine1} <br />
            {closing.titleLine2}
          </h2>
          <p className="st-text-muted st-home-closing-lead">{closing.lead}</p>
          <form className="st-home-closing-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={closing.emailPlaceholder} className="st-home-closing-input" />
            <button type="submit" className="st-btn-head steel-gradient st-home-btn-pad">
              {closing.cta}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
