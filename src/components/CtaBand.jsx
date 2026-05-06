import { Link } from 'react-router-dom';

export default function CtaBand({ line1, accent, line2, body, primaryLabel, secondaryLabel, image, secondaryTo }) {
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
            {line2 ? (
              <>
                <br />
                {line2}
              </>
            ) : null}
          </h2>
          <p className="st-cta-text">{body}</p>
          <div className="st-cta-actions">
            <Link to="/contacts" className="st-btn-primary-lg steel-gradient">
              {primaryLabel}
            </Link>
            {secondaryTo ? (
              <Link to={secondaryTo} className="st-btn-outline-dark st-btn-outline-dark--link">
                {secondaryLabel}
              </Link>
            ) : (
              <button type="button" className="st-btn-outline-dark">
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
