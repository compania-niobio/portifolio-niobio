import { useRef } from 'react';
import { contato } from '../data/contato';
import { scrollToTarget } from '../hooks/useLenis';
import { gsap, useGSAP } from '../lib/gsap';
import { IconArrowUp } from './Icons';

const FRASE = 'Aqui seu desejo se torna realidade';
const PALAVRAS = FRASE.split(' ');

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Recompensa por rolar até o fim: a frase surge letra por letra.
        gsap.from('.footer__letter', {
          autoAlpha: 0,
          yPercent: 70,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.035,
          scrollTrigger: { trigger: '.footer__phrase', start: 'top 78%' },
        });
        gsap.from('.footer__bar', {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          delay: 0.9,
          scrollTrigger: { trigger: '.footer__phrase', start: 'top 78%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer">
      <p className="footer__phrase">
        <span className="sr-only">{FRASE}</span>
        {/* As letras ficam agrupadas por palavra: a linha só quebra entre palavras. */}
        {PALAVRAS.map((palavra, i) => (
          <span key={i} aria-hidden="true">
            <span
              className={
                i === PALAVRAS.length - 1 ? 'footer__word footer__word--gold' : 'footer__word'
              }
            >
              {[...palavra].map((letra, j) => (
                <span key={j} className="footer__letter">
                  {letra}
                </span>
              ))}
            </span>{' '}
          </span>
        ))}
      </p>

      <div className="footer__bar">
        <nav className="footer__links" aria-label="Contatos">
          <a
            href={contato.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram: ${contato.instagram.rotulo} (abre em nova aba)`}
          >
            {contato.instagram.rotulo}
          </a>
          <a
            href={contato.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp: ${contato.whatsapp.rotulo} (abre em nova aba)`}
          >
            {contato.whatsapp.rotulo}
          </a>
          <a
            className="footer__email"
            href={contato.email.url}
            aria-label={`E-mail: ${contato.email.rotulo}`}
          >
            {contato.email.rotulo}
          </a>
        </nav>
        <p className="footer__copy">© Niobio</p>
        <button type="button" className="footer__top" onClick={() => scrollToTarget(0)}>
          Voltar ao topo <IconArrowUp />
        </button>
      </div>
    </footer>
  );
}
