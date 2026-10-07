import { useRef } from 'react';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { gsap, MOTION_OK, shake, useGSAP } from '../lib/gsap';
import Countdown from './Countdown';
import './FinalImmersion.css';

const FRASES = ['Não há mais universo para fugir.', 'Só resta ajoelhar… ou lutar.'];

// Marcos do vídeo final, em segundos. Ajuste aqui se o arquivo for reeditado.
const DURACAO = 18.27;
const INICIO = 0.4; // pula o fade inicial
const CORTE = 8.3; // corte seco de Doom para a logo
const LOGO_PRONTA = 15.3; // a logo termina de se formar
const PAUSA = 0.1; // fração final do scroll com o vídeo parado no último frame

// Enquadramento da logo dentro do frame (frações da largura/altura do vídeo).
const PROPORCAO = 1920 / 804;
const LOGO = { largura: 0.7, altura: 0.46, centroY: 0.43 };

/** Converte um instante do vídeo em progresso (0–1) da seção. */
const em = (segundos: number) => ((segundos - INICIO) / (DURACAO - INICIO)) * (1 - PAUSA);

export default function FinalImmersion() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const countdown = useRef<HTMLDivElement>(null);

  useVideoScrub(video, root, { trimStart: INICIO, hold: PAUSA, lazy: true });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Na parte da logo o vídeo deixa de preencher a tela: ele encolhe e sobe o
        // necessário para a logo caber inteira no espaço acima do relógio.
        const enquadrar = () => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const largura = Math.max(vw, vh * PROPORCAO);
          const altura = largura / PROPORCAO;
          const topo = vh * 0.07;
          const base = countdown.current ? countdown.current.offsetTop : vh * 0.6;
          const livre = Math.max(base - topo, vh * 0.25);
          const scale = Math.min(
            1,
            (vw * 0.92) / (largura * LOGO.largura),
            (livre * 0.92) / (altura * LOGO.altura),
          );
          const centroAtual = vh / 2 + (LOGO.centroY - 0.5) * altura * scale;
          return { scale, y: topo + livre / 2 - centroAtual };
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl.to({}, { duration: 1 }, 0)
          // a janela se abre até virar a tela inteira
          .fromTo(
            '.final__media',
            { clipPath: 'circle(10% at 50% 50%)' },
            { clipPath: 'circle(75% at 50% 50%)', duration: em(2.4), ease: 'power2.inOut' },
            0,
          )
          .to('.final__lead', { opacity: 0, duration: em(1) }, em(0.6))
          // dolly-in e vinheta se fechando sobre Doom
          .fromTo('.final__zoom', { scale: 1, y: 0 }, { scale: 1.12, y: 0, duration: em(CORTE) - em(2) }, em(2))
          .fromTo('.final__vignette', { opacity: 0.25 }, { opacity: 1, duration: em(7.4) - em(2) }, em(2))
          .call(() => shake('.final__shake', 8), undefined, em(CORTE - 0.7))
          // corte: a imagem mergulha no preto e volta já enquadrada na logo
          .to('.final__media', { opacity: 0, duration: em(CORTE) - em(CORTE - 0.3) }, em(CORTE - 0.3))
          .set('.final__zoom', { scale: () => enquadrar().scale, y: () => enquadrar().y }, em(CORTE))
          .set('.final__edge', { opacity: 1 }, em(CORTE))
          .set('.final__vignette', { opacity: 0.3 }, em(CORTE))
          .to('.final__media', { opacity: 1, duration: em(CORTE + 0.5) - em(CORTE) }, em(CORTE));

        const entradas = [2.6, 5.4];
        gsap.utils.toArray<HTMLElement>('.final__frase').forEach((frase, i) => {
          const inicio = em(entradas[i]);
          const fade = em(INICIO + 0.4);
          tl.fromTo(frase, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: fade }, inicio).to(
            frase,
            { opacity: 0, y: -30, duration: fade },
            inicio + em(INICIO + 1.9),
          );
        });

        // o relógio só entra depois que a logo está completa
        tl.fromTo(
          '.final__countdown',
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: em(LOGO_PRONTA + 1.6) - em(LOGO_PRONTA), ease: 'power2.out' },
          em(LOGO_PRONTA),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="final pin" aria-label="Contagem regressiva">
      <span id="contagem" className="final__anchor" />
      <div className="pin__stage">
        <div className="final__media">
          <div className="final__shake">
            <div className="final__zoom">
              <video
                ref={video}
                className="final__video"
                muted
                playsInline
                preload="none"
                poster="/video/final-poster.jpg"
                aria-hidden="true"
                tabIndex={-1}
              >
                <source media="(max-width: 768px)" src="/video/final-scrub-sm.mp4" type="video/mp4" />
                <source src="/video/final-scrub.mp4" type="video/mp4" />
                <source src="/video/final-scrub.webm" type="video/webm" />
              </video>
              <div className="final__edge" />
            </div>
          </div>
          <div className="final__vignette" />
        </div>

        <p className="final__lead eyebrow" aria-hidden="true">
          Aproxime-se
        </p>

        <ol className="final__frases">
          {FRASES.map((frase) => (
            <li key={frase} className="final__frase display">
              {frase}
            </li>
          ))}
        </ol>

        <div ref={countdown} className="final__countdown">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
