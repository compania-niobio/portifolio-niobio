import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/media';

type Dot = { x: number; y: number; vx: number; vy: number; r: number; a: number };

/** Partículas azuis leves que ecoam as dos vídeos e desviam do mouse. */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || prefersReducedMotion()) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = window.innerWidth < 768 ? 22 : 44;
    const mouse = { x: -999, y: -999 };
    let w = 0;
    let h = 0;
    let frame = 0;
    let running = false;

    const dots: Dot[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: -0.00015 - Math.random() * 0.0004,
      r: 0.6 + Math.random() * 1.6,
      a: 0.25 + Math.random() * 0.55,
    }));

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -0.02) d.y = 1.02;
        if (d.x < -0.02) d.x = 1.02;
        if (d.x > 1.02) d.x = -0.02;
        let px = d.x * w;
        let py = d.y * h;
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0.01) {
          const push = (1 - dist / 140) * 26;
          px += (dx / dist) * push;
          py += (dy / dist) * push;
        }
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      ctx.fillStyle = '#4FC3F7';
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    // Só anima enquanto o hero está na tela.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    const section = canvas.closest('section') ?? canvas;

    resize();
    io.observe(section);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
