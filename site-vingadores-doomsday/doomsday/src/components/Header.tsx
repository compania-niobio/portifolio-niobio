import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { scrollToTarget } from '../hooks/useLenis';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import './Header.css';

export default function Header() {
  const ref = useRef<HTMLElement>(null);

  // Some ao rolar para baixo, volta ao rolar para cima.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 80,
      end: 'max',
      onUpdate: (self) => ref.current?.classList.toggle('is-hidden', self.direction === 1),
      onLeaveBack: () => ref.current?.classList.remove('is-hidden'),
    });
  });

  const irParaContagem = (e: MouseEvent) => {
    e.preventDefault();
    scrollToTarget('#contagem');
  };

  return (
    <header ref={ref} className="header">
      <a className="header__logo" href="#topo" onClick={(e) => (e.preventDefault(), scrollToTarget(0))}>
        <strong>NIOBIO</strong>
        <span aria-hidden="true"> — </span>
        <span>Portfólio</span>
      </a>
      <nav aria-label="Principal">
        <a className="header__link" href="#contagem" onClick={irParaContagem}>
          Contagem
        </a>
      </nav>
    </header>
  );
}
