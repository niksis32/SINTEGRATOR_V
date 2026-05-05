export default function CtaBand({ line1, accent, body, primaryLabel, secondaryLabel, image }) {
  return (
    <section className="st-cta-strip st-container">
      <div className="st-cta-inner">
        <div className="st-cta-bg" aria-hidden="true">
          <img alt="" decoding="async" src={image} />
        </div>
        <div className="st-cta-content">
          <h2 className="st-cta-title">
            {line1} <br />
            <span className="title-accent">{accent}</span>
          </h2>
          <p className="st-cta-text">{body}</p>
          <div className="st-cta-actions">
            <a href="#contacts" className="st-btn-primary-lg steel-gradient">
              {primaryLabel}
            </a>
            <button type="button" className="st-btn-outline-dark">
              {secondaryLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
