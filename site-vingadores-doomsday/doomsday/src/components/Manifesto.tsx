import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import './Manifesto.css';

const TRECHOS = [
  { texto: 'Os Vingadores já enfrentaram deuses, titãs e multiversos.', destaque: false },
  { texto: 'Agora enfrentam o homem que os superou em tudo.', destaque: true },
];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
          })
          .fromTo('.manifesto__word', { opacity: 0.15 }, { opacity: 1, duration: 0.08, stagger: 0.04 })
          .from('.manifesto__hook', { opacity: 0, y: 24, duration: 0.15 }, '+=0.05')
          .from('.manifesto__cue', { opacity: 0, duration: 0.1 }, '<0.08')
          .to({}, { duration: 0.12 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="manifesto pin" aria-label="Manifesto">
      <div className="pin__stage">
        <p className="manifesto__text display">
          {TRECHOS.map(({ texto, destaque }) =>
            texto.split(' ').map((palavra, i) => (
              <span key={texto + i} className={destaque ? 'manifesto__word green' : 'manifesto__word'}>
                {palavra}{' '}
              </span>
            )),
          )}
        </p>
        <p className="manifesto__hook">
          Mas para entender quem é ele, você precisa voltar no tempo…
        </p>
        <div className="manifesto__cue cue" aria-hidden="true">
          <span className="cue__line" />
        </div>
      </div>
    </section>
  );
}
