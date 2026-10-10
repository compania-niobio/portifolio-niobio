import { useRef, type RefObject } from 'react';
import { contato } from '../data/contato';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { addBeat } from '../lib/beat';
import { IconInstagram, IconMail, IconWhatsapp } from './Icons';
import { StageVideo } from './StageVideo';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function Etapa3Contato({ videoRef }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useVideoScrub(videoRef, root, {
    stageRef: stage,
    canvasRef: canvas,
    crossfade: true,
    // A seção tem uma tela a mais: o rodapé só entra quando o clarão já tomou tudo.
    end: 'bottom bottom',
    build: (tl, { q, portrait }) => {
      const video = videoRef.current;
      // Imersão: "dolly-in" conforme ele se aproxima do sol.
      tl.fromTo(video, { scale: 1 }, { scale: 1.1, duration: 0.6 }, 0);
      // Retrato: o foco anda de 50% para 45% para manter silhueta e sol no quadro.
      if (portrait) tl.fromTo(video, { xPercent: 0 }, { xPercent: 5, duration: 0.25 }, 0.1);
      // Ele toca o sol.
      addBeat(tl, q('.beat--titulo'), { in: 0.2, out: 0.4 });
      // A luz dourada o envolve: bloco de contato.
      tl.fromTo(
        q('.contact'),
        { autoAlpha: 0, y: 50, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.09, ease: 'power2.out' },
        0.45,
      )
        // O subtítulo entra com leve atraso depois do título.
        .fromTo(
          q('.contact__sub'),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0.51,
        )
        .to(q('.contact'), { autoAlpha: 0, y: -30, duration: 0.06, ease: 'power1.in' }, 0.78);
      // O vídeo clareia: vinheta, faixa de texto e fundo desfocado saem para não sujar o clarão.
      tl.to(q('.copy'), { autoAlpha: 0, duration: 0.05 }, 0.45)
        .to(q('.stage__vignette, .stage__veil'), { autoAlpha: 0, duration: 0.2 }, 0.4)
        .fromTo(q('.stage__backdrop'), { '--dim': 0.6 }, { '--dim': 1, duration: 0.2 }, 0.42);
      // O header sai do branco/dourado antes de ficar sobre o clarão.
      const tone = { v: 0 };
      tl.to(
        tone,
        {
          v: 1,
          duration: 0.01,
          onUpdate: () => document.documentElement.classList.toggle('tone-light', tone.v > 0.5),
        },
        0.66,
      );
      // Clarão branco-bege → mesma cor do rodapé, sem corte.
      tl.fromTo(q('.stage__flash'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, 0.78);
    },
  });

  return (
    <section
      ref={root}
      className="chapter chapter--etapa3 chapter--last"
      aria-label="Etapa 3: contato e orçamento"
    >
      <div id="orcamento" className="chapter__anchor" />
      <div ref={stage} className="stage">
        <StageVideo name="etapa-3" videoRef={videoRef} canvasRef={canvas} positionY="50%" />
        <div className="stage__veil" />
        <div className="stage__flash" aria-hidden="true" />
        <div className="stage__ui">
          <div className="copy copy--top">
            <div className="beat beat--titulo">
              <h2 className="title">Vamos tirar sua ideia do papel?</h2>
            </div>
          </div>

          <div className="contact">
            <div className="contact__panel glass">
              <div className="contact__head">
                <p className="contact__eyebrow">Fale conosco</p>
                <p className="contact__sub">Estamos te esperando</p>
              </div>
              <ul className="contact__list">
                <li>
                  <a
                    className="contact__btn"
                    href={contato.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram da Niobio: ${contato.instagram.rotulo} (abre em nova aba)`}
                  >
                    <IconInstagram />
                    <span>
                      <small>Instagram</small>
                      <b>{contato.instagram.rotulo}</b>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="contact__btn"
                    href={contato.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp da Niobio: ${contato.whatsapp.rotulo} (abre em nova aba)`}
                  >
                    <IconWhatsapp />
                    <span>
                      <small>WhatsApp</small>
                      <b>{contato.whatsapp.rotulo}</b>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="contact__btn"
                    href={contato.email.url}
                    aria-label={`Enviar e-mail para ${contato.email.rotulo}`}
                  >
                    <IconMail />
                    <span>
                      <small>E-mail</small>
                      <b>{contato.email.rotulo}</b>
                    </span>
                  </a>
                </li>
              </ul>
              <a
                className="btn btn--gold btn--lg"
                href={contato.whatsapp.orcamento}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir orçamento pelo WhatsApp (abre em nova aba)"
              >
                Pedir orçamento
              </a>
              <a
                className="contact__tel"
                href={contato.whatsapp.tel}
                aria-label={`Ligar para a Niobio: ${contato.whatsapp.rotulo}`}
              >
                Prefere ligar? Toque aqui.
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
