import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Cursor from './components/Cursor';
import FinalImmersion from './components/FinalImmersion';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import ProgressBar from './components/ProgressBar';
import Timeline from './components/Timeline';
import WhoIsDoom from './components/WhoIsDoom';
import { useLenis } from './hooks/useLenis';
import { ScrollTrigger } from './lib/gsap';

export default function App() {
  useLenis();

  // As fontes mudam a altura dos textos: recalcula os gatilhos quando tudo carregar.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      <ProgressBar />
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Timeline />
        <WhoIsDoom />
        <FinalImmersion />
      </main>
      <Footer />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Analytics />
    </>
  );
}
