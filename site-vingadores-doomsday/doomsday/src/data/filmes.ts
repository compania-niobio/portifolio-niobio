export type Filme = {
  ordem: number;
  titulo: string;
  /** Ano de lançamento, ou período no caso de série. */
  ano: number | string;
  tipo: 'Filme' | 'Série';
  motivo: string;
  /** Nome do arquivo em /poster-vingadores, com {w} no lugar da largura (300, 600, 1200). */
  arquivo: string;
};

const LARGURAS = [300, 600, 1200] as const;

export const posterSrc = (filme: Filme, largura: (typeof LARGURAS)[number] = 600) =>
  `/poster-vingadores/${filme.arquivo.replace('{w}', String(largura))}`;

export const posterSrcSet = (filme: Filme) =>
  LARGURAS.map((w) => `${posterSrc(filme, w)} ${w}w`).join(', ');

export const filmes: Filme[] = [
  {
    ordem: 1,
    titulo: 'Vingadores: Guerra Infinita',
    ano: 2018,
    tipo: 'Filme',
    motivo: 'O dia em que os heróis perderam — e o preço que o universo pagou.',
    arquivo: 'avengers_infinity_war_{w}px.jpg',
  },
  {
    ordem: 2,
    titulo: 'Vingadores: Ultimato',
    ano: 2019,
    tipo: 'Filme',
    motivo: 'O fim da Saga do Infinito e o ponto de partida do multiverso.',
    arquivo: 'avengers_endgame_{w}px.jpg',
  },
  {
    ordem: 3,
    titulo: 'Loki',
    ano: '2021–2023',
    tipo: 'Série',
    motivo: 'Nascem as variantes, a TVA e a Linha do Tempo Sagrada.',
    arquivo: 'loki-{w}.jpg',
  },
  {
    ordem: 4,
    titulo: 'Homem-Aranha: Sem Volta Para Casa',
    ano: 2021,
    tipo: 'Filme',
    motivo: 'As fronteiras entre universos já estão rompidas.',
    arquivo: 'spider_man_poster-{w}.jpg',
  },
  {
    ordem: 5,
    titulo: 'Doutor Estranho no Multiverso da Loucura',
    ano: 2022,
    tipo: 'Filme',
    motivo: 'O multiverso se abre: incursões e perigo real.',
    arquivo: 'estranho-{w}.jpg',
  },
  {
    ordem: 6,
    titulo: 'Pantera Negra: Wakanda para Sempre',
    ano: 2022,
    tipo: 'Filme',
    motivo: 'Namor e o novo equilíbrio de poder entre nações.',
    arquivo: 'wakanda-{w}.jpg',
  },
  {
    ordem: 7,
    titulo: 'Homem-Formiga e a Vespa: Quantumania',
    ano: 2023,
    tipo: 'Filme',
    motivo: 'Kang, o Conquistador, e a ameaça que vem do Reino Quântico.',
    arquivo: 'antman-{w}.jpg',
  },
  {
    ordem: 8,
    titulo: 'Deadpool & Wolverine',
    ano: 2024,
    tipo: 'Filme',
    motivo: 'O Vazio, a TVA e a entrada dos mutantes no MCU.',
    arquivo: 'deadpool-{w}.jpg',
  },
  {
    ordem: 9,
    titulo: 'Capitão América: Admirável Mundo Novo',
    ano: 2025,
    tipo: 'Filme',
    motivo: 'O novo Capitão e o mundo que sobrou depois do Blip.',
    arquivo: 'capitao-{w}.jpg',
  },
  {
    ordem: 10,
    titulo: 'Thunderbolts*',
    ano: 2025,
    tipo: 'Filme',
    motivo: 'O novo time de anti-heróis e o Vazio.',
    arquivo: 'thunderbolts-{w}.jpg',
  },
  {
    ordem: 11,
    titulo: 'Quarteto Fantástico: Primeiros Passos',
    ano: 2025,
    tipo: 'Filme',
    motivo: 'A Terra-828, a família que o MCU esperava e a cena pós-créditos que apresenta Doom.',
    arquivo: 'fantastic4-{w}.jpg',
  },
];
