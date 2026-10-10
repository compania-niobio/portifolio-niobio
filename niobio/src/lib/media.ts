export type VideoName = 'hero' | 'etapa-1' | 'etapa-2' | 'etapa-3';

const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

// Escolhida uma única vez ao carregar: trocar o src no resize recarregaria o vídeo.
const SMALL_VIDEO = window.innerWidth <= 1024 || connection?.saveData === true;

const base = `${import.meta.env.BASE_URL}video/`;

export function videoSources(name: VideoName) {
  const suffix = SMALL_VIDEO ? '-sm' : '';
  return {
    mp4: `${base}${name}${suffix}.mp4`,
    webm: `${base}${name}.webm`,
    poster: `${base}${name}${suffix}.jpg`,
    posterSmall: `${base}${name}-sm.jpg`,
  };
}

const primed = new WeakSet<HTMLVideoElement>();

/** Passa o vídeo de preload="none" para "auto" e inicia o download (uma vez só). */
export function primeVideo(video: HTMLVideoElement | null | undefined) {
  if (!video || primed.has(video)) return;
  primed.add(video);
  if (video.readyState > 0) return;
  video.preload = 'auto';
  video.load();
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
