import { posterSrc, posterSrcSet } from '../data/filmes';
import type { Filme } from '../data/filmes';

export default function TimelineCard({ filme }: { filme: Filme }) {
  return (
    <li className="tcard">
      <article className="tcard__inner">
        <div className="tcard__meta">
          <span className="tcard__num display">{String(filme.ordem).padStart(2, '0')}</span>
          <span className="tcard__tag">
            {filme.tipo} · {filme.ano}
          </span>
        </div>
        <div className="tcard__poster">
          <img
            src={posterSrc(filme)}
            srcSet={posterSrcSet(filme)}
            sizes="(max-width: 600px) 60vw, 310px"
            alt={`Pôster de ${filme.titulo}`}
            loading="lazy"
            decoding="async"
            width={600}
            height={900}
          />
        </div>
        <h3 className="tcard__title display">{filme.titulo}</h3>
        <p className="tcard__why">{filme.motivo}</p>
      </article>
    </li>
  );
}
