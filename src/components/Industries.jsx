import { Link } from 'react-router-dom';
import { useSiteData } from '../data/siteData.js';
import { usePreferences } from '../contexts/PreferencesContext.jsx';
import MaterialIcon from './MaterialIcon.jsx';

export default function Industries() {
  const { industriesMeta, methodologyIntro, methodologySteps, industryBlocks } = useSiteData();
  const { lang } = usePreferences();

  const labels = {
    manufacturing: lang === 'ru' ? 'Производство' : 'Manufacturing',
    manufacturingLead:
      lang === 'ru'
        ? 'Автоматизация цеховых процессов, внедрение MES-систем и предиктивная аналитика оборудования для заводов нового поколения.'
        : 'Shop-floor automation, MES rollout, and predictive equipment analytics for next-generation plants.',
    kpi1: lang === 'ru' ? 'Операционный KPI' : 'Operational KPI',
    kpi1Suffix: lang === 'ru' ? 'снижение издержек' : 'cost reduction',
    kpi2: lang === 'ru' ? 'Опыт внедрения' : 'Implementation track record',
    kpi2Suffix: lang === 'ru' ? 'крупных заводов' : 'large plants',
    logistics: lang === 'ru' ? 'Логистика' : 'Logistics',
    logisticsLead:
      lang === 'ru'
        ? 'WMS нового поколения и сквозной мониторинг цепей поставок в реальном времени.'
        : 'Next-gen WMS and real-time end-to-end supply chain monitoring.',
    opsPerDay: lang === 'ru' ? 'ОПЕРАЦИЙ В СУТКИ' : 'OPS PER DAY',
    exploreCases: lang === 'ru' ? 'СМОТРЕТЬ КЕЙСЫ' : 'EXPLORE CASES',
    b2b: lang === 'ru' ? 'B2B Опт' : 'B2B Wholesale',
    b2bLead:
      lang === 'ru'
        ? 'Цифровые платформы для дистрибуции: от личного кабинета до автоматического ценообразования.'
        : 'Distribution platforms: from self-service accounts to automated pricing.',
    avgCheck: lang === 'ru' ? 'Рост чека' : 'Average order growth',
    transparency: lang === 'ru' ? 'Прозрачность' : 'Transparency',
  };

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
                    {labels.manufacturing}
                  </h3>
                  <p className="st-text-muted" style={{ fontSize: '1.0625rem', maxWidth: '36rem' }}>
                    {labels.manufacturingLead}
                  </p>
                </div>
                <div className="st-kpi-grid">
                  <div>
                    <p className="st-kpi-label">{labels.kpi1}</p>
                    <p className="st-kpi-value">
                      24% <span className="st-kpi-suffix">{labels.kpi1Suffix}</span>
                    </p>
                  </div>
                  <div>
                    <p className="st-kpi-label">{labels.kpi2}</p>
                    <p className="st-kpi-value">
                      15+ <span className="st-kpi-suffix">{labels.kpi2Suffix}</span>
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
                    {labels.logistics}
                  </h3>
                  <p className="st-text-muted" style={{ fontSize: '0.875rem', maxWidth: '22rem' }}>
                    {labels.logisticsLead}
                  </p>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-panel" style={{ background: 'rgb(255 255 255 / 0.05)', borderColor: 'rgb(255 255 255 / 0.1)', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <div className="st-kpi-value" style={{ color: '#fff' }}>
                      4.2 млн
                    </div>
                    <div className="st-kpi-suffix" style={{ color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>
                      {labels.opsPerDay}
                    </div>
                  </div>
                  <Link className="st-link-arrow" to="/cases" style={{ color: '#fff' }}>
                    {labels.exploreCases} <MaterialIcon name="arrow_right_alt" style={{ fontSize: '1rem' }} />
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
                    {labels.b2b}
                  </h3>
                  <p className="st-text-muted" style={{ fontSize: '0.875rem', marginBottom: '2rem' }}>
                    {labels.b2bLead}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(197, 198, 204, 0.3)', paddingBottom: '1rem' }}>
                    <span className="st-kpi-suffix" style={{ fontSize: '0.625rem' }}>
                      {labels.avgCheck}
                    </span>
                    <span className="st-kpi-value" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                      +45%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(197, 198, 204, 0.3)', paddingBottom: '1rem' }}>
                    <span className="st-kpi-suffix" style={{ fontSize: '0.625rem' }}>
                      {labels.transparency}
                    </span>
                    <span className="st-kpi-value" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                      100%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Methodology 8 */}
            <div className="st-span-8 st-surface-muted st-methodology-panel">
              <div className="micro-grid" style={{ position: 'absolute', inset: 0, opacity: 0.22, pointerEvents: 'none' }} />
              <div className="pad-industry-xl st-methodology-inner">
                <div>
                  <h3 className="st-card-title" style={{ fontSize: '2rem', fontFamily: 'var(--font-head)' }}>
                    {methodologyIntro.title}
                  </h3>
                  <p className="st-text-muted" style={{ marginBottom: '2rem' }}>
                    {methodologyIntro.text}
                  </p>
                  <div className="st-tag-cloud st-tag-cloud--method">
                    {methodologyIntro.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="st-method-steps st-method-steps--card">
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
