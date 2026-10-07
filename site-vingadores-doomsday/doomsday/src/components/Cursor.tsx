import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import './Cursor.css';

/** Anel verde que segue o mouse no desktop. O cursor nativo continua visível. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const anel = ref.current!;
      const x = gsap.quickTo(anel, 'x', { duration: 0.45, ease: 'power3' });
      const y = gsap.quickTo(anel, 'y', { duration: 0.45, ease: 'power3' });

      const mover = (e: PointerEvent) => {
        anel.classList.add('is-on');
        x(e.clientX);
        y(e.clientY);
      };
      const sobre = (e: PointerEvent) => {
        const alvo = e.target instanceof Element && e.target.closest('a, button, .tcard__inner');
        anel.classList.toggle('is-hover', Boolean(alvo));
      };

      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerover', sobre);
      return () => {
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerover', sobre);
      };
    });
  });

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__ring" />
    </div>
  );
}
