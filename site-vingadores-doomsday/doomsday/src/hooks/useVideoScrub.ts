import type { RefObject } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap';

type Options = {
  /** Posições do ScrollTrigger em relação ao gatilho. */
  start?: string;
  end?: string;
  /** Segundos ignorados no começo/fim do vídeo (ex.: frames pretos). */
  trimStart?: number;
  trimEnd?: number;
  /** Fração final do scroll em que o vídeo fica parado no último frame (0–1). */
  hold?: number;
  /** Só baixa o vídeo quando a seção estiver chegando. */
  lazy?: boolean;
};

/** Primeiro <source> que o navegador toca e cuja media query bate com a tela. */
function escolherFonte(video: HTMLVideoElement) {
  const fontes = Array.from(video.querySelectorAll('source'));
  const fonte = fontes.find(
    (s) => (!s.media || window.matchMedia(s.media).matches) && (!s.type || video.canPlayType(s.type)),
  );
  return fonte?.src;
}

/**
 * Atrela o `currentTime` do vídeo ao progresso de scroll do gatilho.
 * O arquivo é baixado inteiro para a memória antes, para que cada seek seja imediato.
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  {
    start = 'top top',
    end = 'bottom bottom',
    trimStart = 0,
    trimEnd = 0,
    hold = 0,
    lazy = false,
  }: Options = {},
) {
  useGSAP(() => {
    const video = videoRef.current;
    const trigger = triggerRef.current;
    if (!video || !trigger) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const playhead = { t: trimStart };
      let pending: number | null = null;
      let timeline: gsap.core.Timeline | undefined;
      let objectUrl: string | undefined;
      let cancelled = false;

      // Um seek por vez: o próximo só sai quando o navegador terminar o anterior.
      const flush = () => {
        if (pending === null || video.seeking) return;
        const t = pending;
        pending = null;
        if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
      };
      const seek = (t: number) => {
        pending = t;
        flush();
      };

      const onMetadata = () => {
        if (!timeline) {
          timeline = gsap
            .timeline({ scrollTrigger: { trigger, start, end, scrub: 0.5 } })
            .to(playhead, {
              t: video.duration - trimEnd,
              duration: 1 - hold,
              ease: 'none',
              onUpdate: () => seek(playhead.t),
            })
            .to({}, { duration: hold });
        }
        seek(playhead.t);
      };

      const load = async () => {
        try {
          const src = escolherFonte(video);
          if (!src) return;
          const blob = await (await fetch(src)).blob();
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          video.src = objectUrl;
          video.load();
        } catch {
          // Sem o blob o vídeo segue no streaming normal do navegador.
          if (video.readyState === 0) video.load();
        }
      };

      video.addEventListener('loadedmetadata', onMetadata);
      video.addEventListener('seeked', flush);
      if (video.readyState >= 1) onMetadata();

      let loader: ScrollTrigger | undefined;
      if (lazy) {
        loader = ScrollTrigger.create({
          trigger,
          start: 'top bottom+=150%',
          once: true,
          onEnter: load,
        });
      } else {
        load();
      }

      return () => {
        cancelled = true;
        loader?.kill();
        video.removeEventListener('loadedmetadata', onMetadata);
        video.removeEventListener('seeked', flush);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    });

    return () => mm.revert();
  });
}
