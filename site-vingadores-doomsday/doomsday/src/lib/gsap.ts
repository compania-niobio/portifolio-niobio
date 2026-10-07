import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Tremor curto de câmera; volta sozinho para a posição original. */
export function shake(target: gsap.TweenTarget, intensity = 10) {
  gsap.fromTo(
    target,
    { x: 0, y: 0 },
    {
      keyframes: [
        { x: -intensity, y: intensity * 0.5 },
        { x: intensity * 0.8, y: -intensity * 0.4 },
        { x: -intensity * 0.5, y: intensity * 0.3 },
        { x: intensity * 0.3, y: -intensity * 0.2 },
        { x: 0, y: 0 },
      ],
      duration: 0.45,
      ease: 'power1.inOut',
      overwrite: true,
    },
  );
}

export { gsap, ScrollTrigger, useGSAP };
