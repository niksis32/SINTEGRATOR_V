import { Link } from 'react-router-dom';
import { industriesMeta, methodologyIntro, methodologySteps, industryBlocks } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function Industries() {
  return (
    <section id="industries" className="st-industries blueprint-grid st-container">
      <div className="micro-grid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />
      <div className="st-watermark" aria-hidden="true">
        <h2>{industriesMeta.watermark}</h2>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="st-section-title-center">
          <h2>{industriesMeta.title}</h2>
          <div className="st-divider-accent steel-gradient" />
        </div>

        <div className="st-industry-shell">
          <div className="circuit-line st-circuit-h" />
          <div className="circuit-line st-circuit-v-2" />

          <div className="st-industry-grid">
            {/* Manufacturing 8 */}
            <div className="st-span-8 st-border-b-muted st-border-r-muted st-industry-panel" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="st-cover-hover" style={{ backgroundImage: industryBlocks.manufacturingImage }} />
              <div className="st-industry-inner pad-industry-xl">
                <div>
                  <div className="domain-icon-wrap">
                    <div className="icon-box glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcon name="factory" className="" filled />
                    </div>
                    <span className="domain-label">DOMAIN / MANUFACTURING</span>
                  </div>
                  <h3 className="st-display-sm" style={{ marginBottom: '2rem', fontFamily: 'var(--font-head)' }}>
                    Производство
                  </h3>
                  <p className="st-text-muted" style={{ fontSize: '1.0625rem', maxWidth: '36rem' }}>
                    Автоматизация цеховых процессов, внедрение MES-систем и предиктивная аналитика оборудования для заводов нового
                    поколения.
                  </p>
                </div>
                <div className="st-kpi-grid">
                  <div>
                    <p className="st-kpi-label">Операционный KPI</p>
                    <p className="st-kpi-value">
                      24% <span className="st-kpi-suffix">снижение издержек</span>
                    </p>
                  </div>
                  <div>
                    <p className="st-kpi-label">Опыт внедрения</p>
                    <p className="st-kpi-value">
                      15+ <span className="st-kpi-suffix">крупных заводов</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics 4 */}
            <div className="st-span-4 st-border-b-muted st-inverse-panel st-industry-panel" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="st-cover-hover" style={{ backgroundImage: industryBlocks.logisticsImage }} />
              <div className="pad-industry-xl" style={{ height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div className="icon-box" style={{ background: 'rgb(255 255 255 / 0.1)', borderRadius: '0.5rem', border: '1px solid rgb(255 255 255 / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', width: '3rem', height: '3rem' }}>
                    <MaterialIcon name="local_shipping" style={{ color: '#fff', fontSize: '1.5rem' }} />
                  </div>
                  <h3 className="st-card-title st-display-sm" style={{ fontSize: '1.875rem', color: '#fff' }}>
                    Логистика
                  </h3>
                  <p className="st-text-muted" style={{ fontSize: '0.875rem', maxWidth: '22rem' }}>
                    WMS нового поколения и сквозной мониторинг цепей поставок в реальном времени.
                  </p>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-panel" style={{ background: 'rgb(255 255 255 / 0.05)', borderColor: 'rgb(255 255 255 / 0.1)', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <div className="st-kpi-value" style={{ color: '#fff' }}>
                      4.2 млн
                    </div>
                    <div className="st-kpi-suffix" style={{ color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>
                      ОПЕРАЦИЙ В СУТКИ
                    </div>
                  </div>
                  <Link className="st-link-arrow" to="/cases" style={{ color: '#fff' }}>
                    EXPLORE CASES <MaterialIcon name="arrow_right_alt" style={{ fontSize: '1rem' }} />
                  </Link>
                </div>
              </div>
            </div>

            {/* B2B wholesale 4 */}
            <div className="st-span-4 st-border-r-muted milled-surface">
              <div className="pad-industry-md" style={{ justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <MaterialIcon name="hub" className="" style={{ fontSize: '2.5rem', opacity: 0.4, color: 'var(--primary)', marginBottom: '2rem', display: 'block' }} />
                  <h3 className="st-card-title" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-head)', marginBottom: '1rem' }}>
                    B2B Опт
                  </h3>
                  <p className="st-text-muted" style={{ fontSize: '0.875rem', marginBottom: '2rem' }}>
                    Цифровые платформы для дистрибуции: от личного кабинета до автоматического ценообразования.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(197, 198, 204, 0.3)', paddingBottom: '1rem' }}>
                    <span className="st-kpi-suffix" style={{ fontSize: '0.625rem' }}>
                      Рост чека
                    </span>
                    <span className="st-kpi-value" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                      +45%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(197, 198, 204, 0.3)', paddingBottom: '1rem' }}>
                    <span className="st-kpi-suffix" style={{ fontSize: '0.625rem' }}>
                      Прозрачность
                    </span>
                    <span className="st-kpi-value" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                      100%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Methodology 8 */}
            <div className="st-span-8 st-surface-muted">
              <div className="micro-grid" style={{ position: 'absolute', inset: 0, opacity: 0.22, pointerEvents: 'none' }} />
              <div className="pad-industry-xl st-methodology-inner">
                <div>
                  <h3 className="st-card-title" style={{ fontSize: '2rem', fontFamily: 'var(--font-head)' }}>
                    {methodologyIntro.title}
                  </h3>
                  <p className="st-text-muted" style={{ marginBottom: '2rem' }}>
                    {methodologyIntro.text}
                  </p>
                  <div className="st-tag-cloud">
                    {methodologyIntro.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="st-method-steps">
                  {methodologySteps.map(([num, label]) => (
                    <div className="st-method-step" key={num}>
                      <span className="st-method-num">{num}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
