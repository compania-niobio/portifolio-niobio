import { scrollToTarget } from '../hooks/useLenis';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Projeto de portfólio · <strong>Niobio</strong>
      </p>
      <p className="footer__disclaimer">
        Site conceito feito por fãs, sem afiliação oficial com a Marvel Studios ou a Disney. Marcas,
        pôsteres e personagens pertencem aos seus respectivos donos.
      </p>
      <button type="button" className="footer__top" onClick={() => scrollToTarget(0)}>
        <span aria-hidden="true">↑</span> Voltar ao topo
      </button>
    </footer>
  );
}
