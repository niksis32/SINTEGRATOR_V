import { hero } from '../data/siteData.js';

export default function Hero() {
  return (
    <section id="home" className="st-hero-home st-container">
      <div className="st-hero-grid">
        <div>
          <span className="st-eyebrow">{hero.eyebrow}</span>
          <h1 className="st-display">
            {hero.titleLine1}
            <br />
            <span className="st-title-accent">{hero.titleAccent}</span>
          </h1>
        </div>
        <div>
          <p className="st-text-muted" style={{ fontSize: '1.25rem' }}>
            {hero.lead}
          </p>
        </div>
      </div>
    </section>
  );
}
