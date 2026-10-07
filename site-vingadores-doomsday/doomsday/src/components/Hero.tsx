import { useRef } from 'react';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import './Hero.css';

const FRASES = [
  'Todo império começa com um trono.',
  'Um homem esperou por este momento.',
  'Ele não vem pedir permissão.',
];

const letras = (texto: string) =>
  [...texto].map((char, i) => (
    <span key={i} className="hero__char" aria-hidden="true">
      {char}
    </span>
  ));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useVideoScrub(video, root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Abertura: tela preta, o salão aparece e o título entra letra por letra.
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to('.hero__curtain', { opacity: 0, duration: 2, ease: 'power2.inOut' })
          .from('.hero__char', { yPercent: 70, opacity: 0, duration: 1.2, stagger: 0.05 }, '-=1.1')
          .from('.hero__date', { y: 16, opacity: 0, duration: 1 }, '-=0.6')
          .from('.hero__cue', { opacity: 0, duration: 1 }, '-=0.4');

        // Scroll: o título se dissolve e as frases entram uma por vez, junto com o vídeo.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        });
        tl.to({}, { duration: 1 }, 0)
          .to('.hero__heading', { scale: 1.5, opacity: 0, duration: 0.18 }, 0)
          .to('.hero__cue-wrap', { opacity: 0, duration: 0.08 }, 0);

        gsap.utils.toArray<HTMLElement>('.hero__frase').forEach((frase, i) => {
          const inicio = 0.22 + i * 0.25;
          tl.fromTo(frase, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.07 }, inicio).to(
            frase,
            { opacity: 0, y: -30, duration: 0.07 },
            inicio + 0.16,
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="topo" className="hero pin">
      <div className="pin__stage">
        <video
          ref={video}
          className="hero__video"
          muted
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source media="(max-width: 768px)" src="/video/hero-scrub-sm.mp4" type="video/mp4" />
          <source src="/video/hero-scrub.mp4" type="video/mp4" />
          <source src="/video/hero-scrub.webm" type="video/webm" />
        </video>
        <div className="hero__shade" />
        <div className="hero__curtain" />

        <div className="hero__heading">
          <h1 className="hero__title display" aria-label="Vingadores: Doomsday">
            <span className="hero__title-top">{letras('VINGADORES:')}</span>
            <span className="hero__title-main">{letras('DOOMSDAY')}</span>
          </h1>
          <p className="hero__date">18 de dezembro de 2026</p>
        </div>

        <ol className="hero__frases">
          {FRASES.map((frase) => (
            <li key={frase} className="hero__frase display">
              {frase}
            </li>
          ))}
        </ol>

        <div className="hero__cue-wrap">
          <div className="hero__cue cue">
            <span>Role para entrar</span>
            <span className="cue__line" />
          </div>
        </div>
      </div>
    </section>
  );
}
