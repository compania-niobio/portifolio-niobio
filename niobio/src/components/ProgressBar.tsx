import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/** Barra fina dourada no topo: progresso da página inteira. */
export function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      },
    );
  });

  return (
    <div className="progress" aria-hidden="true">
      <div ref={bar} className="progress__bar" />
    </div>
  );
}
