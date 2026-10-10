export type Projeto = {
  titulo: string;
  cliente: string;
  categoria: string;
  descricao: string;
  url: string;
  imagem: string;
};

const img = `${import.meta.env.BASE_URL}img/projetos/`;

// Para adicionar um projeto, basta incluir um item aqui (a imagem fica em public/img/projetos/).
export const projetos: Projeto[] = [
  {
    titulo: 'Social Media',
    cliente: 'Isadora Rezende',
    categoria: 'Portfólio',
    descricao: 'Portfólio de social media com identidade própria e foco em conversão.',
    url: 'https://isadorarezende.vercel.app/',
    imagem: `${img}isadora-rezende.webp`,
  },
  {
    titulo: 'Vingadores: Doomsday',
    cliente: 'Projeto Niobio',
    categoria: 'Site promocional',
    descricao:
      'Site promocional cinematográfico com vídeo atrelado ao scroll, linha do tempo e contagem regressiva para a estreia.',
    url: 'https://vingadoresdoomsday.vercel.app/',
    imagem: `${img}vingadores-doomsday.webp`,
  },
];
