import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import IndustriesPage from './pages/IndustriesPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import CasesPage from './pages/CasesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import EmailTestPage from './pages/EmailTestPage.jsx';
import SeoHead from './components/SeoHead.jsx';
import MaintenanceScreen from './components/MaintenanceScreen.jsx';
import { hasMaintenanceBypass, maintenanceMode } from './config/siteVisibility.js';
import ChatWidget from './components/ChatWidget.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [maintenanceUnlocked, setMaintenanceUnlocked] = useState(
    () => !maintenanceMode || hasMaintenanceBypass(),
  );

  const seoHeadKey = maintenanceMode
    ? maintenanceUnlocked
      ? 'maint-pass'
      : 'maint-gate'
    : 'public';

  if (maintenanceMode && !maintenanceUnlocked) {
    return (
      <>
        <ScrollToTop />
        <SeoHead key={seoHeadKey} />
        <MaintenanceScreen onUnlocked={() => setMaintenanceUnlocked(true)} />
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <SeoHead key={seoHeadKey} />
      <Header />
      <main className="st-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/test-email" element={<EmailTestPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
