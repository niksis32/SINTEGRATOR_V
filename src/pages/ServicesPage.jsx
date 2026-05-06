import Services from '../components/Services.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { useSiteData } from '../data/siteData.js';

export default function ServicesPage() {
  const { ctaAfterServices } = useSiteData();
  return (
    <>
      <Services />
      <CtaBand {...ctaAfterServices} secondaryTo="/cases" />
    </>
  );
}
