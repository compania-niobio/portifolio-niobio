import type { CSSProperties, RefObject } from 'react';
import { videoSources, type VideoName } from '../lib/media';

type Props = {
  name: VideoName;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Carrega já na abertura (só o hero). */
  eager?: boolean;
  /** Ponto focal horizontal (0–1) da camada da frente em retrato. */
  focus?: number;
  /** Posição vertical do recorte em paisagem (object-position). */
  positionY?: string;
};

/**
 * Vídeo de fundo de uma etapa.
 * Paisagem: tela cheia em cover. Retrato: "vídeo enquadrado" (vídeo nítido com 220vw
 * sobre um fundo desfocado do mesmo frame), para não cortar o sujeito nem o sol.
 */
export function StageVideo({ name, videoRef, canvasRef, eager, focus = 0.5, positionY = '30%' }: Props) {
  const src = videoSources(name);
  return (
    <div
      className="stage__media"
      style={{ '--focus': focus, '--pos-y': positionY } as CSSProperties}
      aria-hidden="true"
    >
      <div className="stage__backdrop">
        <img src={src.posterSmall} alt="" decoding="async" loading={eager ? 'eager' : 'lazy'} />
        <canvas ref={canvasRef} width={96} height={54} />
      </div>
      <video
        ref={videoRef}
        className="stage__video"
        muted
        playsInline
        disablePictureInPicture
        preload={eager ? 'auto' : 'none'}
        poster={src.poster}
        tabIndex={-1}
      >
        <source src={src.mp4} type="video/mp4" />
        <source src={src.webm} type="video/webm" />
      </video>
      <div className="stage__vignette" />
    </div>
  );
}
