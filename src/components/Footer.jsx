import { Link } from 'react-router-dom';
import { useSiteData } from '../data/siteData.js';

export default function Footer() {
  const { footer } = useSiteData();
  const year = new Date().getFullYear();
  return (
    <footer className="st-footer">
      <div className="st-footer-grid st-container">
        <div>
          <Link className="st-logo" to="/" style={{ marginBottom: '1.75rem', display: 'inline-block' }}>
            {footer.brandName}
          </Link>
          <p className="st-footer-desc">{footer.description}</p>
        </div>
        <div>
          <h5>{footer.headings.services}</h5>
          <ul className="st-footer-list">
            {footer.services.map((s) => (
              <li key={s}>
                <Link to="/services">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>{footer.headings.company}</h5>
          <ul className="st-footer-list">
            {footer.company.map((s) => (
              <li key={s.label}>
                <Link to={s.path}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>{footer.headings.legal}</h5>
          <ul className="st-footer-list">
            {footer.legal.map((s) => (
              <li key={s.label}>
                <Link to={s.path}>{s.label}</Link>
              </li>
            ))}
          </ul>
          <p className="st-footer-address">{footer.address}</p>
          <p className="st-footer-phone">{footer.phone}</p>
        </div>
      </div>
      <div className="st-footer-bottom">
        <div>
          © {year} {footer.brandName}. {footer.bottom.rights}
        </div>
        <div className="st-footer-soc">
          {footer.bottom.socials.map((s) => (
            <Link key={s.label} to={s.path}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
