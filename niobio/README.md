# Niobio: site de portfólio

One-page cinematográfico em React + Vite + TypeScript, com GSAP/ScrollTrigger e Lenis.
Quatro vídeos atrelados ao scroll formam uma viagem contínua: hero, quem somos, projetos e contato.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build
```

## Onde mexer

- `src/data/projetos.ts`: lista de projetos. Adicione um item e a imagem em `public/img/projetos/`.
- `src/data/contato.ts`: Instagram, WhatsApp, e-mail e mensagem do orçamento.
- `src/styles/variables.css`: cores, fontes e escala tipográfica.
- `src/hooks/useVideoScrub.ts`: vídeo atrelado ao scroll (usado pelas 4 seções).
- `src/hooks/useHeadAnchor.ts`: posição do "NIO / BIO" ao lado da cabeça.

## Vídeos

Os originais ficam em `../assets/video/`. As versões em `public/video/` foram geradas com
todo frame como keyframe e sem áudio (necessário para o scrub ficar suave):

```bash
ffmpeg -i inicio.mp4 -an -c:v libx264 -g 1 -crf 22 -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i inicio.mp4 -an -vf scale=1280:-2 -c:v libx264 -g 1 -crf 23 -pix_fmt yuv420p -movflags +faststart hero-sm.mp4
```

Cada vídeo tem a versão 1920px, a `-sm` de 1280px (telas até 1024px ou economia de dados),
um `.webm` e o poster `.jpg` do primeiro frame.
