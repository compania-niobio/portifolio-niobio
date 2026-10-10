import { useEffect, type RefObject } from 'react';
import { ScrollTrigger } from '../lib/gsap';

/** Medidas tiradas dos frames de inicio.mp4 (frações do quadro 1920×1080). */
const VIDEO = { width: 1920, height: 1080 };
const HEAD = { left: 0.4, right: 0.6, lineStart: 0.3, lineEnd: 0.24 };

export type HeadBox = {
  /** Bordas da cabeça em px, relativas à camada da seção. */
  left: number;
  right: number;
  /** Linha do texto em px: no início e no fim do hero. */
  lineStart: number;
  lineEnd: number;
  /** Largura do vídeo renderizado e da área visível. */
  videoWidth: number;
  stageWidth: number;
};

function measure(video: HTMLVideoElement): HeadBox {
  const style = getComputedStyle(video);
  const boxW = video.offsetWidth;
  const boxH = video.offsetHeight;
  const [px = 50, py = 50] = style.objectPosition.split(' ').map((v) => parseFloat(v));
  const fit = style.objectFit === 'cover' ? Math.max : Math.min;
  const scale = fit(boxW / VIDEO.width, boxH / VIDEO.height);
  const w = VIDEO.width * scale;
  const h = VIDEO.height * scale;
  // Deslocamento do recorte do object-fit + object-position dentro da caixa do <video>.
  const x0 = video.offsetLeft + (boxW - w) * (px / 100);
  const y0 = video.offsetTop + (boxH - h) * (py / 100);
  return {
    left: x0 + w * HEAD.left,
    right: x0 + w * HEAD.right,
    lineStart: y0 + h * HEAD.lineStart,
    lineEnd: y0 + h * HEAD.lineEnd,
    videoWidth: w,
    stageWidth: video.offsetParent instanceof HTMLElement ? video.offsetParent.offsetWidth : boxW,
  };
}

/**
 * Converte a posição da cabeça (coordenadas do vídeo) em pixels da tela,
 * considerando o recorte do vídeo, e avisa a cada mudança de layout.
 */
export function useHeadAnchor(
  videoRef: RefObject<HTMLVideoElement | null>,
  onChange: (box: HeadBox) => void,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => onChange(measure(video));

    let timer = 0;
    const debounced = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(update, 200);
    };

    update();
    window.addEventListener('resize', debounced);
    window.addEventListener('orientationchange', debounced);
    ScrollTrigger.addEventListener('refresh', update);
    document.fonts.ready.then(update);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', debounced);
      window.removeEventListener('orientationchange', debounced);
      ScrollTrigger.removeEventListener('refresh', update);
    };
  }, [videoRef, onChange]);
}
