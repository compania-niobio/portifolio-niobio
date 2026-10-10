import type { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { primeVideo } from '../lib/media';

const FPS = 24;

export type ScrubContext = {
  portrait: boolean;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  /** Celular em paisagem: altura muito pequena. */
  short: boolean;
  /** Seletor restrito à seção. */
  q: (selector: string) => Element[];
};

type Options = {
  /** Camada fixa da seção (vídeo + textos). */
  stageRef: RefObject<HTMLElement | null>;
  /** Canvas do fundo desfocado (modo "vídeo enquadrado" em retrato). */
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  /** Vídeo da próxima seção: começa a carregar quando esta passa da metade. */
  nextVideoRef?: RefObject<HTMLVideoElement | null>;
  /** Entra em crossfade sobre a seção anterior (últimos ~5% dela). */
  crossfade?: boolean;
  /** Esconde a camada depois que a próxima seção assumiu. */
  hideOnLeave?: boolean;
  /** Fim do trecho de scroll (padrão: 'bottom top'). */
  end?: string;
  /** Adiciona as animações de texto à timeline (duração total normalizada em 1). */
  build?: (tl: gsap.core.Timeline, ctx: ScrubContext) => void;
};

/**
 * Atrela o vídeo ao scroll da seção: currentTime = progresso × duração.
 * A mesma timeline (scrub) carrega os textos, então tudo anda em sincronia com o vídeo.
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  options: Options,
) {
  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const video = videoRef.current;
      const stage = options.stageRef.current;
      if (!trigger || !video || !stage) return;

      const mm = gsap.matchMedia(triggerRef);
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          portrait: '(orientation: portrait)',
          mobile: '(max-width: 767px)',
          tablet: '(min-width: 768px) and (max-width: 1199px)',
          desktop: '(min-width: 1200px)',
          short: '(max-height: 500px)',
        },
        (mctx) => {
          const c = mctx.conditions as Record<string, boolean>;
          // Movimento reduzido: sem scrub; cada etapa fica estática com o poster (ver CSS).
          if (c.reduce) return;

          const ctx: ScrubContext = {
            portrait: c.portrait,
            mobile: c.mobile,
            tablet: c.tablet,
            desktop: c.desktop,
            short: c.short,
            q: gsap.utils.selector(trigger),
          };

          const state = { p: 0 };
          let pending: number | null = null;

          const drawBackdrop = () => {
            const canvas = options.canvasRef?.current;
            if (!canvas || !ctx.portrait || video.readyState < 2) return;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
          };

          const seek = () => {
            if (!video.duration) return;
            const max = video.duration - 1 / FPS;
            const t = Math.min(max, Math.round(state.p * video.duration * FPS) / FPS);
            // Nunca enfileira seeks: guarda o último pedido e aplica quando o anterior terminar.
            if (video.seeking) {
              pending = t;
              return;
            }
            if (Math.abs(video.currentTime - t) > 0.5 / FPS) video.currentTime = t;
          };

          const onSeeked = () => {
            drawBackdrop();
            if (pending !== null) {
              const t = pending;
              pending = null;
              if (Math.abs(video.currentTime - t) > 0.5 / FPS) video.currentTime = t;
            }
          };
          // O scrub só passa a valer depois dos metadados (antes disso não há duração).
          const onReady = () => {
            seek();
            drawBackdrop();
          };

          video.addEventListener('seeked', onSeeked);
          video.addEventListener('loadedmetadata', onReady);
          video.addEventListener('loadeddata', onReady);

          const setHidden = (hidden: boolean) => {
            if (options.hideOnLeave) gsap.set(stage, { visibility: hidden ? 'hidden' : 'inherit' });
          };

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger,
              start: 'top top',
              end: options.end ?? 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
              onEnter: () => primeVideo(video),
              onEnterBack: () => {
                primeVideo(video);
                setHidden(false);
              },
              onLeave: () => setHidden(true),
              onRefresh: (self) => {
                if (self.progress === 1 && !self.isActive) setHidden(true);
              },
              onUpdate: (self) => {
                if (self.progress > 0.5) primeVideo(options.nextVideoRef?.current);
              },
            },
          });
          tl.to(state, { p: 1, duration: 1, onUpdate: seek }, 0);
          options.build?.(tl, ctx);

          if (options.crossfade) {
            gsap.fromTo(
              stage,
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger,
                  start: 'top 12%',
                  end: 'top top',
                  scrub: true,
                  onEnter: () => primeVideo(video),
                },
              },
            );
          }

          if (video.readyState >= 1) onReady();

          return () => {
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('loadedmetadata', onReady);
            video.removeEventListener('loadeddata', onReady);
          };
        },
      );
    },
    { scope: triggerRef },
  );
}
