import IndustriesIntro from '../components/IndustriesIntro.jsx';
import Industries from '../components/Industries.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { useSiteData } from '../data/siteData.js';

export default function IndustriesPage() {
  const { ctaBeforeContact } = useSiteData();
  return (
    <>
      <IndustriesIntro />
      <Industries />
      <CtaBand {...ctaBeforeContact} />
    </>
  );
}
