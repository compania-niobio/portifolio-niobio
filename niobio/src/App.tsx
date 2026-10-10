import { useEffect, useRef } from 'react';
import { Cursor } from './components/Cursor';
import { Etapa1QuemSomos } from './components/Etapa1QuemSomos';
import { Etapa2Projetos } from './components/Etapa2Projetos';
import { Etapa3Contato } from './components/Etapa3Contato';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProgressBar } from './components/ProgressBar';
import { useLenis } from './hooks/useLenis';
import { useReadingPosition } from './hooks/useReadingPosition';
import { ScrollTrigger } from './lib/gsap';

export default function App() {
  useLenis();
  useReadingPosition();

  // Um ref por vídeo: cada seção conhece o vídeo da próxima para pré-carregá-lo.
  const hero = useRef<HTMLVideoElement>(null);
  const etapa1 = useRef<HTMLVideoElement>(null);
  const etapa2 = useRef<HTMLVideoElement>(null);
  const etapa3 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // As fontes mudam o tamanho dos textos: recalcula depois que carregarem.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    const video = hero.current;
    const refresh = () => ScrollTrigger.refresh();
    video?.addEventListener('loadedmetadata', refresh, { once: true });
    return () => video?.removeEventListener('loadedmetadata', refresh);
  }, []);

  return (
    <>
      <ProgressBar />
      <Header />
      <main>
        <Hero videoRef={hero} nextVideoRef={etapa1} />
        <Etapa1QuemSomos videoRef={etapa1} nextVideoRef={etapa2} />
        <Etapa2Projetos videoRef={etapa2} nextVideoRef={etapa3} />
        <Etapa3Contato videoRef={etapa3} />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
