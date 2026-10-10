import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/media';

let instance: Lenis | null = null;

/** Rola até um seletor/posição usando o Lenis (ou a rolagem nativa, com movimento reduzido). */
export function scrollToTarget(target: string | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.6 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

/** Salta para uma posição sem animar (ex.: restaurar a leitura após girar a tela). */
export function jumpTo(y: number) {
  if (instance) instance.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

/** Scroll suave global, iniciado uma única vez no App e sincronizado com o ScrollTrigger. */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: false });
    instance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
