import Cases from '../components/Cases.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { casesFinalCta } from '../data/siteData.js';

export default function CasesPage() {
  return (
    <>
      <Cases />
      <Testimonials />
      <CtaBand {...casesFinalCta} />
    </>
  );
}
