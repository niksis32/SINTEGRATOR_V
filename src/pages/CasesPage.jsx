import Cases from '../components/Cases.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { useSiteData } from '../data/siteData.js';

export default function CasesPage() {
  const { casesFinalCta } = useSiteData();
  return (
    <>
      <Cases />
      <Testimonials />
      <CtaBand {...casesFinalCta} />
    </>
  );
}
