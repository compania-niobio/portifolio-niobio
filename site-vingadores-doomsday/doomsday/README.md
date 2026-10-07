# Vingadores: Doomsday — site conceito

Site one-page de lançamento (projeto de portfólio da **Niobio**), feito com React + Vite + TypeScript, GSAP/ScrollTrigger e Lenis. Site de fã, sem afiliação oficial.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build
```

## Adicionar um filme à linha do tempo

1. Coloque o pôster em `public/poster-vingadores/` nas três larguras (300, 600 e 1200 px).
2. Adicione uma entrada em `src/data/filmes.ts`. Em `arquivo`, use `{w}` no lugar da largura, por exemplo `quantumania-{w}.jpg`.
3. Ajuste o campo `ordem` dos demais filmes. O contador e o scroll horizontal se recalculam sozinhos.

## Vídeos

Os vídeos em `public/video/` são gerados a partir dos originais (1920×1080) em `../assets/video/`, com as tarjas pretas recortadas e todo frame como keyframe (necessário para o scrub ficar suave). Cada um tem uma versão cheia e uma `-sm` (960 px) usada em telas até 768 px:

```bash
ffmpeg -i victor-van-doom_final.mp4 -vf "crop=1920:804:0:138" -c:v libx264 -preset slow -g 1 -crf 28 -pix_fmt yuv420p -an -movflags +faststart final-scrub.mp4
ffmpeg -i victor-van-doom_final.mp4 -vf "crop=1920:804:0:138,scale=960:402" -c:v libx264 -preset slow -g 1 -crf 26 -pix_fmt yuv420p -an -movflags +faststart final-scrub-sm.mp4
ffmpeg -i victor-van-doom_final.mp4 -vf "crop=1920:804:0:138" -c:v libvpx-vp9 -g 1 -crf 42 -b:v 0 -an final-scrub.webm
```

O mesmo vale para `victor-van-doom_video.mp4` → `hero-scrub.*`.

Se o vídeo final for reeditado, ajuste os marcos no topo de `src/components/FinalImmersion.tsx` (duração, instante do corte para a logo e quando a logo fica pronta).

## Estrutura

- `src/components/` — uma seção por componente (Hero, Manifesto, Timeline, WhoIsDoom, FinalImmersion, Countdown…)
- `src/hooks/` — `useLenis`, `useVideoScrub`, `useCountdown`
- `src/data/filmes.ts` — dados da linha do tempo
- `src/styles/` — tokens (`variables.css`) e base (`global.css`)

Com `prefers-reduced-motion`, as seções deixam de ficar fixas e todo o conteúdo aparece de forma estática.
