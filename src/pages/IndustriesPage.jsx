import IndustriesIntro from '../components/IndustriesIntro.jsx';
import Industries from '../components/Industries.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { ctaBeforeContact } from '../data/siteData.js';

export default function IndustriesPage() {
  return (
    <>
      <IndustriesIntro />
      <Industries />
      <CtaBand {...ctaBeforeContact} />
    </>
  );
}
