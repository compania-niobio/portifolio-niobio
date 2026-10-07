import { useRef } from 'react';
import { gsap, MOTION_OK, shake, useGSAP } from '../lib/gsap';
import './WhoIsDoom.css';

const TITULOS = ['Gênio.', 'Monarca.', 'Feiticeiro.'];

export default function WhoIsDoom() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
        });

        // Cada título bate na tela: entra, o fundo pisca em verde e a câmera treme.
        gsap.utils.toArray<HTMLElement>('.who__word').forEach((palavra, i) => {
          const inicio = 0.08 + i * 0.22;
          tl.fromTo(
            palavra,
            { opacity: 0, scale: 1.6 },
            { opacity: 1, scale: 1, duration: 0.07, ease: 'power3.in' },
            inicio,
          )
            .call(() => shake('.who__stage', 12), undefined, inicio + 0.07)
            .fromTo('.who__flash', { opacity: 0 }, { opacity: 0.9, duration: 0.02 }, inicio + 0.06)
            .to('.who__flash', { opacity: 0, duration: 0.1 }, inicio + 0.08);
        });

        tl.from('.who__hook', { opacity: 0, y: 24, duration: 0.1 }, 0.76)
          .from('.who__cue', { opacity: 0, duration: 0.08 }, 0.82)
          .to({}, { duration: 0.1 }, 0.9);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="who pin" aria-labelledby="who-titulo">
      <div className="pin__stage">
        <div className="who__flash" />
        <div className="who__stage">
          <h2 id="who-titulo" className="eyebrow">
            Quem é Victor Von Doom
          </h2>
          <ol className="who__words">
            {TITULOS.map((titulo) => (
              <li key={titulo} className="who__word display">
                {titulo}
              </li>
            ))}
          </ol>
          <p className="who__hook">Ele já está esperando por você.</p>
          <div className="who__cue cue" aria-hidden="true">
            <span className="cue__line" />
          </div>
        </div>
      </div>
    </section>
  );
}
