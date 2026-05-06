import { useSiteData } from '../data/siteData.js';

export default function IndustriesIntro() {
  const { industriesIntro } = useSiteData();
  return (
    <section className="st-container st-industries-intro">
      <div className="st-hero-grid">
        <div>
          <span className="st-eyebrow">{industriesIntro.eyebrow}</span>
          <h1 className="st-display">
            {industriesIntro.titleLine1}
            <br />
            <span className="st-title-accent">{industriesIntro.titleAccent}</span>
          </h1>
        </div>
        <div>
          <p className="st-text-muted" style={{ fontSize: '1.25rem' }}>
            {industriesIntro.lead}
          </p>
        </div>
      </div>
    </section>
  );
}
