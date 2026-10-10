import { useRef, type MouseEvent } from 'react';
import { scrollToTarget } from '../hooks/useLenis';
import { ScrollTrigger, useGSAP } from '../lib/gsap';

const img = `${import.meta.env.BASE_URL}img/`;

/** Header fixo minimalista: some ao rolar para baixo e volta ao rolar para cima. */
export function Header() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 80,
      end: 'max',
      onUpdate: (self) => ref.current?.classList.toggle('is-hidden', self.direction === 1),
      onLeaveBack: () => ref.current?.classList.remove('is-hidden'),
    });
  });

  const go = (target: string | number) => (event: MouseEvent) => {
    event.preventDefault();
    scrollToTarget(target);
  };

  return (
    <header ref={ref} className="header">
      <a className="header__logo" href="#topo" onClick={go(0)} aria-label="Niobio, voltar ao topo">
        <img
          src={`${img}logo-azul-600.png`}
          srcSet={`${img}logo-azul-300.png 300w, ${img}logo-azul-600.png 600w, ${img}logo-azul-1200.png 1200w`}
          sizes="(max-width: 767px) 40px, 56px"
          alt="Niobio"
          width={600}
          height={600}
          decoding="async"
          fetchPriority="high"
        />
      </a>
      <a className="header__cta" href="#orcamento" onClick={go('#orcamento')}>
        Orçamento
      </a>
    </header>
  );
}
