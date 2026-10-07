import { useRef } from 'react';
import { filmes } from '../data/filmes';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap';
import './Timeline.css';
import TimelineCard from './TimelineCard';

const TOTAL = String(filmes.length).padStart(2, '0');

export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current!;
        const trilho = track.current!;
        const cards = gsap.utils.toArray<HTMLElement>('.tcard');
        const distancia = () => trilho.scrollWidth - window.innerWidth;

        // A seção ganha a altura exata para que 1px de scroll vertical mova 1px na horizontal.
        const ajustarAltura = () => {
          section.style.height = `${window.innerHeight + distancia()}px`;
        };
        ajustarAltura();
        ScrollTrigger.addEventListener('refreshInit', ajustarAltura);

        let ativo = -1;
        const marcarAtivo = (progresso: number) => {
          const indice = Math.round(progresso * (cards.length - 1));
          if (indice === ativo) return;
          ativo = indice;
          cards.forEach((card, i) => card.classList.toggle('is-active', i === indice));
          if (counter.current) {
            counter.current.textContent =
              indice < filmes.length ? String(indice + 1).padStart(2, '0') : TOTAL;
          }
        };

        const rolagem = gsap.to(trilho, {
          x: () => -distancia(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => marcarAtivo(self.progress),
          },
        });
        marcarAtivo(0);

        const scrub = { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 };
        gsap.fromTo('.timeline__line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: scrub });
        gsap.fromTo('.timeline__bg', { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: scrub });

        cards.forEach((card) => {
          gsap.from(card, {
            y: 70,
            opacity: 0,
            rotateY: -28,
            transformPerspective: 900,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: rolagem,
              start: 'left 98%',
              end: 'left 62%',
              scrub: true,
            },
          });
        });

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', ajustarAltura);
          section.style.height = '';
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="timeline pin" aria-labelledby="timeline-titulo">
      <div className="pin__stage">
        <div className="timeline__bg" />

        <header className="timeline__head">
          <div>
            <p className="eyebrow">Linha do tempo</p>
            <h2 id="timeline-titulo" className="timeline__title display">
              O que assistir antes
            </h2>
          </div>
          <p className="timeline__counter display" aria-hidden="true">
            <span ref={counter}>01</span> / {TOTAL}
          </p>
        </header>

        <div className="timeline__rail">
          <div className="timeline__line" />
          <ol ref={track} className="timeline__track">
            {filmes.map((filme) => (
              <TimelineCard key={filme.ordem} filme={filme} />
            ))}

            <li className="tcard tcard--final">
              <article className="tcard__inner">
                <div className="tcard__meta">
                  <span className="tcard__num display green">18/12/2026</span>
                  <span className="tcard__tag">Estreia</span>
                </div>
                <div className="tcard__poster">
                  <img
                    src="/video/doomsday-card-600.jpg"
                    srcSet="/video/doomsday-card-300.jpg 300w, /video/doomsday-card-600.jpg 600w, /video/doomsday-card-1200.jpg 1200w"
                    sizes="(max-width: 600px) 60vw, 310px"
                    alt="Victor Von Doom de braços abertos sob um céu em chamas"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={900}
                  />
                </div>
                <h3 className="tcard__title display green">Vingadores: Doomsday</h3>
                <p className="tcard__why">Agora você está pronto. Quase.</p>
              </article>
            </li>
          </ol>
        </div>

        <div className="timeline__cue cue" aria-hidden="true">
          <span className="cue__line" />
        </div>
      </div>
    </section>
  );
}
