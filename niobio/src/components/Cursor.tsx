import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/media';

/** Cursor dourado customizado: só em dispositivos com mouse (hover + ponteiro fino). */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('is-on');
      const target = e.target instanceof Element ? e.target.closest('a, button') : null;
      el.classList.toggle('is-active', target !== null);
    };
    const onLeave = () => el.classList.remove('is-on');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
