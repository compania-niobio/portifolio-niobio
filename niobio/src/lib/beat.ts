type Range = { in: number; out?: number; y?: number; duration?: number };

/**
 * Um "tempo" de texto dentro da timeline da etapa: entra em `in`, sai em `out`
 * (posições de 0 a 1, em sincronia com o vídeo). Sem `out`, permanece na tela.
 */
export function addBeat(
  tl: gsap.core.Timeline,
  target: gsap.TweenTarget,
  { in: start, out, y = 28, duration = 0.07 }: Range,
) {
  tl.fromTo(
    target,
    { autoAlpha: 0, y },
    { autoAlpha: 1, y: 0, duration, ease: 'power2.out' },
    start,
  );
  if (out !== undefined) {
    tl.to(target, { autoAlpha: 0, y: -y * 0.6, duration: 0.05, ease: 'power1.in' }, out);
  }
  return tl;
}
