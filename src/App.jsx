import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Industries from './components/Industries.jsx';
import Services from './components/Services.jsx';
import CtaBand from './components/CtaBand.jsx';
import Cases from './components/Cases.jsx';
import Testimonials from './components/Testimonials.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { ctaAfterServices, ctaBeforeContact } from './data/siteData.js';

export default function App() {
  return (
    <>
      <Header />
      <main className="st-main">
        <Hero />
        <Industries />
        <Services />
        <CtaBand {...ctaAfterServices} />
        <Cases />
        <Testimonials />
        <About />
        <CtaBand {...ctaBeforeContact} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
