import { useRef, type CSSProperties, type RefObject } from 'react';
import { projetos } from '../data/projetos';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { addBeat } from '../lib/beat';
import { IconArrowDown } from './Icons';
import { ProjetoCard, ProjetoFantasma } from './ProjetoCard';
import { StageVideo } from './StageVideo';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  nextVideoRef: RefObject<HTMLVideoElement | null>;
};

const total = projetos.length;
const doisDigitos = (n: number) => String(n).padStart(2, '0');

export function Etapa2Projetos({ videoRef, nextVideoRef }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useVideoScrub(videoRef, root, {
    stageRef: stage,
    canvasRef: canvas,
    nextVideoRef,
    crossfade: true,
    hideOnLeave: true,
    build: (tl, { q, mobile }) => {
      // Ele desenha o anel de estrelas: o projeto já entra.
      tl.fromTo(
        q('.cards'),
        { autoAlpha: 0, y: 60, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.09, ease: 'power2.out' },
        0.04,
      );
      if (total > 1) {
        // Vários projetos: a fileira anda com o scroll (lista vertical abaixo de 768px).
        const [viewport] = q('.cards__viewport') as HTMLElement[];
        const [track] = q('.cards__track') as HTMLElement[];
        const travel = { p: 0 };
        tl.to(
          track,
          mobile
            ? { y: () => -Math.max(0, track.scrollHeight - viewport.clientHeight), duration: 0.17 }
            : { x: () => -Math.max(0, track.scrollWidth - viewport.clientWidth), duration: 0.17 },
          0.4,
        ).to(
          travel,
          {
            p: 1,
            duration: 0.17,
            onUpdate: () => {
              if (counter.current) {
                counter.current.textContent = doisDigitos(Math.round(travel.p * (total - 1)) + 1);
              }
            },
          },
          0.4,
        );
      }
      tl.to(q('.cards'), { autoAlpha: 0, y: -40, duration: 0.06, ease: 'power1.in' }, 0.59);
      // O sol dourado cresce e ele flutua até ele.
      addBeat(tl, q('.beat--gancho'), { in: 0.72, out: 0.95 });
    },
  });

  return (
    <section
      ref={root}
      className="chapter chapter--etapa2"
      style={{ '--extra': (total - 1) * 0.5 } as CSSProperties}
      aria-label="Etapa 2: projetos"
    >
      <div ref={stage} className="stage">
        <StageVideo name="etapa-2" videoRef={videoRef} canvasRef={canvas} focus={0.52} positionY="40%" />
        <div className="stage__veil" />
        <div className="stage__ui">
          <div className="copy">
            <div className="beat beat--gancho hook">
              <p>Agora é a sua vez de alcançar a luz…</p>
              <span className="hook__arrow">
                <IconArrowDown />
              </span>
            </div>
          </div>

          <div className="cards">
            {total > 1 && (
              <p className="cards__counter" aria-hidden="true">
                <span ref={counter}>01</span> / {doisDigitos(total)}
              </p>
            )}
            <div className="cards__viewport">
              <div className="cards__track">
                {projetos.map((projeto) => (
                  <ProjetoCard key={projeto.url} projeto={projeto} />
                ))}
                {total === 1 && <ProjetoFantasma />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
