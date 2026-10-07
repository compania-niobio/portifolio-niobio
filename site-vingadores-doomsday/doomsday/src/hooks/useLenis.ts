import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap';

let instance: Lenis | null = null;

export const getLenis = () => instance;

/** Rola até um alvo usando o Lenis; sem Lenis (movimento reduzido), usa o scroll nativo. */
export function scrollToTarget(target: number | string) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.8 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target });
  } else {
    document.querySelector(target)?.scrollIntoView();
  }
}

/** Inicia o scroll suave uma única vez e o sincroniza com o ScrollTrigger. */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
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
