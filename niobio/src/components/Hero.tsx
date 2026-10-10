import { useCallback, useRef, type RefObject } from 'react';
import { useHeadAnchor, type HeadBox } from '../hooks/useHeadAnchor';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { gsap, useGSAP } from '../lib/gsap';
import { Particles } from './Particles';
import { ScrollHint } from './ScrollHint';
import { StageVideo } from './StageVideo';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  nextVideoRef: RefObject<HTMLVideoElement | null>;
};

const clamp = gsap.utils.clamp;

export function Hero({ videoRef, nextVideoRef }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nio = useRef<HTMLSpanElement>(null);
  const bio = useRef<HTMLSpanElement>(null);
  const layout = useRef<{ box: HeadBox | null; gap: number; drift: number; progress: number }>({
    box: null,
    gap: 0,
    drift: 0,
    progress: 0,
  });

  /** Posiciona as sílabas ao lado da cabeça, acompanhando-a conforme o vídeo avança. */
  const place = useCallback((progress: number) => {
    const l = layout.current;
    l.progress = progress;
    if (!l.box || !nio.current || !bio.current) return;
    // A cabeça sobe quando ele veste o óculos: a linha vai de ~30% para ~24% do quadro.
    const rise = clamp(0, 1, (progress - 0.08) / 0.27);
    const y = gsap.utils.interpolate(l.box.lineStart, l.box.lineEnd, rise);
    // As mãos sobem até o óculos: as sílabas abrem espaço, se houver sobra lateral.
    const drift = clamp(0, 1, (progress - 0.1) / 0.2) * l.drift;
    // xPercent/yPercent alinham a borda certa ao ponto: direita do "NIO", esquerda do "BIO".
    gsap.set(nio.current, { xPercent: -100, yPercent: -50, x: l.box.left - l.gap - drift, y });
    gsap.set(bio.current, { xPercent: 0, yPercent: -50, x: l.box.right + l.gap + drift, y });
  }, []);

  /** Ajusta o tamanho da fonte ao espaço livre de cada lado da cabeça. */
  const fit = useCallback(
    (box: HeadBox) => {
      const a = nio.current;
      const b = bio.current;
      if (!a || !b) return;
      const l = layout.current;
      const vw = box.stageWidth;
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      const max = portrait ? clamp(44, 256, vw * 0.22) : clamp(64, 256, vw * 0.14);

      // Largura das sílabas por px de fonte (depende da fonte já carregada).
      a.style.fontSize = b.style.fontSize = '100px';
      const ratio = Math.max(a.offsetWidth, b.offsetWidth) / 100;

      const gap = clamp(6, 40, box.videoWidth * 0.012);
      const edge = clamp(6, 48, vw * 0.025);
      const available = Math.min(box.left, vw - box.right) - gap - edge;
      // Caber inteiro vale mais que o tamanho mínimo: nunca corta letra nem invade o rosto.
      const size = Math.max(10, Math.min(max, available / ratio));
      a.style.fontSize = b.style.fontSize = `${size}px`;

      l.box = box;
      l.gap = gap;
      l.drift = Math.max(0, Math.min(box.videoWidth * 0.06, available - size * ratio));
      place(l.progress);
    },
    [place],
  );

  useHeadAnchor(videoRef, fit);

  useVideoScrub(videoRef, root, {
    stageRef: stage,
    canvasRef: canvas,
    nextVideoRef,
    hideOnLeave: true,
    build: (tl, { q }) => {
      const head = { p: 0 };
      tl.to(head, { p: 1, duration: 1, onUpdate: () => place(head.p) }, 0)
        .to(q('.hero__hint'), { autoAlpha: 0, duration: 0.05 }, 0.01)
        .to(q('.hero__tag'), { autoAlpha: 0, y: -12, duration: 0.08 }, 0.44)
        // A lente acende: as sílabas se afastam e se dissolvem.
        .to(
          q('.syll--nio .syll__inner'),
          { xPercent: -45, autoAlpha: 0, filter: 'blur(16px)', duration: 0.16, ease: 'power1.in' },
          0.52,
        )
        .to(
          q('.syll--bio .syll__inner'),
          { xPercent: 45, autoAlpha: 0, filter: 'blur(16px)', duration: 0.16, ease: 'power1.in' },
          0.52,
        );
    },
  });

  // Abertura (sem scroll): tela azul-marinho → vídeo → sílabas deslizam até a cabeça.
  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo(
            '.hero__curtain',
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 1.4, ease: 'power2.inOut' },
          )
          .from('.syll--nio .ch', { x: '-1.1em', autoAlpha: 0, duration: 1.1, stagger: 0.09 }, 0.45)
          .from(
            '.syll--bio .ch',
            { x: '1.1em', autoAlpha: 0, duration: 1.1, stagger: { each: 0.09, from: 'end' } },
            0.45,
          )
          .from('.hero__tag-inner', { autoAlpha: 0, y: 16, duration: 0.9 }, 1.3)
          .from('.hero__hint-inner', { autoAlpha: 0, duration: 0.9 }, 1.7);
      });
    },
    { scope: root },
  );

  const letters = (text: string) =>
    [...text].map((ch, i) => (
      <span key={i} className="ch">
        {ch}
      </span>
    ));

  return (
    <section ref={root} id="topo" className="chapter chapter--hero" aria-label="Niobio">
      <div ref={stage} className="stage">
        <StageVideo name="hero" videoRef={videoRef} canvasRef={canvas} eager positionY="30%" />
        <div className="stage__veil" />
        <Particles />
        <div className="stage__ui">
          <h1 className="sr-only">Niobio: estratégia, posicionamento e design</h1>
          <span ref={nio} className="syll syll--nio" aria-hidden="true">
            <span className="syll__inner">{letters('NIO')}</span>
          </span>
          <span ref={bio} className="syll syll--bio" aria-hidden="true">
            <span className="syll__inner">{letters('BIO')}</span>
          </span>

          <div className="hero__bottom">
            <p className="hero__tag">
              <span className="hero__tag-inner">Estratégia · Posicionamento · Design</span>
            </p>
            <div className="hero__hint">
              <div className="hero__hint-inner">
                <ScrollHint />
              </div>
            </div>
          </div>
        </div>
        <div className="hero__curtain" aria-hidden="true" />
      </div>
    </section>
  );
}
