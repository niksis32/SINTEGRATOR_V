import Services from '../components/Services.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { ctaAfterServices } from '../data/siteData.js';

export default function ServicesPage() {
  return (
    <>
      <Services />
      <CtaBand {...ctaAfterServices} secondaryTo="/cases" />
    </>
  );
}
