import type { Projeto } from '../data/projetos';
import { IconArrowUpRight } from './Icons';

export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  // Espaço não separável antes do ponto: na quebra de linha ele fica com o título.
  const nome = `${projeto.titulo} · ${projeto.cliente}`;
  return (
    <article className="card glass">
      <div className="card__preview">
        <span className="card__chrome" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <img
          src={projeto.imagem}
          alt={`Prévia do site ${projeto.titulo} de ${projeto.cliente}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="card__body">
        <p className="card__cat">{projeto.categoria}</p>
        <h3 className="card__title">{nome}</h3>
        <p className="card__desc">{projeto.descricao}</p>
        <a
          className="btn btn--gold"
          href={projeto.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver projeto ${nome} (abre em nova aba)`}
        >
          Ver projeto <IconArrowUpRight />
        </a>
      </div>
    </article>
  );
}

/** Card fantasma: fecha a lista de projetos, como gancho para o contato. */
export function ProjetoFantasma() {
  return (
    <div className="card card--ghost">
      <p>O próximo pode ser o seu.</p>
    </div>
  );
}
