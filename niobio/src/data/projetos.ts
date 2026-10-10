export type Projeto = {
  titulo: string;
  cliente: string;
  categoria: string;
  descricao: string;
  url: string;
  imagem: string;
};

// Para adicionar um projeto, basta incluir um item aqui (a imagem fica em public/img/projetos/).
export const projetos: Projeto[] = [
  {
    titulo: 'Social Media',
    cliente: 'Isadora Rezende',
    categoria: 'Portfólio',
    descricao: 'Portfólio de social media com identidade própria e foco em conversão.',
    url: 'https://portifolio-social-media-pi.vercel.app/',
    imagem: `${import.meta.env.BASE_URL}img/projetos/isadora-rezende.jpg`,
  },
];
