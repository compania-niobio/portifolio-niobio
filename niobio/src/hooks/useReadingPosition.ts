import { useEffect } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import { jumpTo } from './useLenis';

/**
 * Mantém a posição de leitura quando a largura da tela muda (ex.: girar o celular):
 * guarda em qual seção o usuário está e quanto dela já rolou, e restaura após o refresh.
 */
export function useReadingPosition() {
  useEffect(() => {
    const sections = () => Array.from(document.querySelectorAll<HTMLElement>('.chapter, .footer'));
    const saved = { index: 0, progress: 0, width: window.innerWidth };

    const save = () => {
      // Durante a troca de orientação o navegador ainda ajusta o scroll: não sobrescreve.
      if (window.innerWidth !== saved.width) return;
      const y = window.scrollY;
      const list = sections();
      const index = Math.max(0, list.findLastIndex((el) => el.offsetTop <= y + 1));
      const el = list[index];
      if (!el) return;
      saved.index = index;
      saved.progress = (y - el.offsetTop) / el.offsetHeight;
    };

    const restore = () => {
      if (window.innerWidth === saved.width) return;
      saved.width = window.innerWidth;
      const el = sections()[saved.index];
      if (!el) return;
      jumpTo(el.offsetTop + saved.progress * el.offsetHeight);
      ScrollTrigger.update();
    };

    let timer = 0;
    const onOrientation = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    window.addEventListener('scroll', save, { passive: true });
    window.addEventListener('orientationchange', onOrientation);
    ScrollTrigger.addEventListener('refresh', restore);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', save);
      window.removeEventListener('orientationchange', onOrientation);
      ScrollTrigger.removeEventListener('refresh', restore);
    };
  }, []);
}
