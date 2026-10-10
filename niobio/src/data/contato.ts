const whatsappNumero = '5514998001784';
const mensagemOrcamento = 'Olá, Niobio! Quero um orçamento para o meu projeto.';

export const contato = {
  instagram: {
    rotulo: '@niobio_company',
    url: 'https://instagram.com/niobio_company',
  },
  whatsapp: {
    rotulo: '+55 (14) 99800-1784',
    url: `https://wa.me/${whatsappNumero}`,
    tel: `tel:+${whatsappNumero}`,
    orcamento: `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensagemOrcamento)}`,
  },
  email: {
    rotulo: 'fundacaoniobio@gmail.com',
    url: 'mailto:fundacaoniobio@gmail.com?subject=Or%C3%A7amento%20Niobio',
  },
} as const;
