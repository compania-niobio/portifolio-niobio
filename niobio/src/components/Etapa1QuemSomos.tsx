import { useRef, type RefObject } from 'react';
import { certificados } from '../data/certificados';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { addBeat } from '../lib/beat';
import { IconArrowDown, IconCheck } from './Icons';
import { StageVideo } from './StageVideo';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  nextVideoRef: RefObject<HTMLVideoElement | null>;
};

const FRASE = ['Transformando', 'suas', 'ideias', 'em', 'impacto.'];
const PILARES = ['Estratégia', 'Posicionamento', 'Design'];

export function Etapa1QuemSomos({ videoRef, nextVideoRef }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useVideoScrub(videoRef, root, {
    stageRef: stage,
    canvasRef: canvas,
    nextVideoRef,
    crossfade: true,
    hideOnLeave: true,
    build: (tl, { q }) => {
      // 1. Linhas de luz percorrem o corpo: o nome e, um a um, os certificados.
      addBeat(tl, q('.beat--nome'), { in: 0.04, out: 0.25 });
      tl.fromTo(
        q('.cert'),
        { autoAlpha: 0, x: 40 },
        { autoAlpha: 1, x: 0, duration: 0.04, stagger: 0.02, ease: 'power2.out' },
        0.08,
      );
      // 2. A espiral de partículas sobe: frase revelada palavra por palavra.
      tl.fromTo(q('.beat--frase'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.31)
        .fromTo(
          q('.beat--frase .w'),
          { opacity: 0.15 },
          { opacity: 1, duration: 0.05, stagger: 0.035 },
          0.33,
        )
        .to(q('.beat--frase'), { autoAlpha: 0, y: -16, duration: 0.05 }, 0.56);
      // 3. Ele se dissolve em luz: os três pilares, um a um.
      tl.fromTo(q('.beat--pilares'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.62)
        .fromTo(
          q('.beat--pilares li'),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.05, stagger: 0.05, ease: 'power2.out' },
          0.63,
        )
        .to(q('.beat--pilares'), { autoAlpha: 0, duration: 0.04 }, 0.79);
      // Gancho: de costas, olhando a estrela.
      addBeat(tl, q('.beat--gancho'), { in: 0.84, out: 0.95 });
    },
  });

  return (
    <section ref={root} className="chapter chapter--etapa1" aria-label="Etapa 1: quem somos">
      <div ref={stage} className="stage">
        <StageVideo name="etapa-1" videoRef={videoRef} canvasRef={canvas} positionY="25%" />
        <div className="stage__veil" />
        <div className="stage__ui">
          <div className="copy">
            <div className="beat beat--nome">
              <div className="nome">
                <h2 className="title">Prazer, Lucas Batista.</h2>
                <p className="lead">Fundador da Niobio.</p>
              </div>
              <div className="certs">
                <h3 className="certs__title">Certificados</h3>
                <ul className="certs__list">
                  {certificados.map((certificado) => (
                    <li key={certificado} className="cert">
                      <IconCheck />
                      {certificado}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="beat beat--frase phrase">
              {FRASE.map((palavra, i) => (
                <span key={palavra} className={i === FRASE.length - 1 ? 'w w--gold' : 'w'}>
                  {palavra}{' '}
                </span>
              ))}
            </p>

            <ul className="beat beat--pilares pillars">
              {PILARES.map((pilar) => (
                <li key={pilar}>{pilar}</li>
              ))}
            </ul>

            <div className="beat beat--gancho hook">
              <p>Mas não acredite só na nossa palavra. Veja o que já construímos…</p>
              <span className="hook__arrow">
                <IconArrowDown />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
