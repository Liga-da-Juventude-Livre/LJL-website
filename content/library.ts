// Book recommendations. `download` is set only where the publisher itself offers the book free and authorised;
// each link was checked on 2026-10-17. Add a book here and it appears on /library.

export type Book = {
  title: string;
  author: string;
  year: number;
  front: "Economia" | "Instituições" | "Educação" | "Direito" | "Filosofia" | "Empreendedorismo";
  level: "Iniciante" | "Intermediário" | "Avançado";
  note: string;
  start?: boolean;
  download?: { url: string; language: string; source: string; edition: string };
};

export const books: Book[] = [
  {
    title: "As Seis Lições",
    author: "Ludwig von Mises",
    year: 1979,
    front: "Economia",
    level: "Iniciante",
    start: true,
    note: "Seis palestras dadas em Buenos Aires sobre capitalismo, socialismo, intervencionismo, inflação e investimento, sem jargão.",
    download: {
      url: "https://mises.org/library/book/economic-policy-thoughts-today-and-tomorrow",
      language: "Inglês e espanhol",
      source: "Mises Institute",
      edition: "Economic Policy: Thoughts for Today and Tomorrow",
    },
  },
  {
    title: "A Lei",
    author: "Frédéric Bastiat",
    year: 1850,
    front: "Direito",
    level: "Iniciante",
    start: true,
    note: "Um texto curto sobre o que a lei deve proteger e sobre o momento em que ela vira instrumento para tirar de uns e dar a outros.",
    download: {
      url: "https://mises.org/library/book/law",
      language: "Inglês e espanhol",
      source: "Mises Institute",
      edition: "The Law",
    },
  },
  {
    title: "Economia numa Única Lição",
    author: "Henry Hazlitt",
    year: 1946,
    front: "Economia",
    level: "Iniciante",
    start: true,
    note: "Ensina a olhar para os efeitos de uma política sobre todos, no longo prazo, e não só sobre um grupo e no curto prazo.",
  },
  {
    title: "O que se Vê e o que não se Vê",
    author: "Frédéric Bastiat",
    year: 1850,
    front: "Economia",
    level: "Iniciante",
    note: "O ensaio da janela quebrada: o custo invisível que acompanha toda decisão econômica.",
  },
  {
    title: "A Riqueza das Nações",
    author: "Adam Smith",
    year: 1776,
    front: "Economia",
    level: "Intermediário",
    note: "A divisão do trabalho e a mão invisível, na obra que fundou a economia moderna.",
  },
  {
    title: "Ação Humana",
    author: "Ludwig von Mises",
    year: 1949,
    front: "Economia",
    level: "Avançado",
    note: "O tratado completo da Escola Austríaca, construído a partir das escolhas de cada indivíduo.",
    download: {
      url: "https://mises.org/library/book/human-action",
      language: "Inglês",
      source: "Mises Institute",
      edition: "Human Action",
    },
  },
  {
    title: "O Caminho da Servidão",
    author: "Friedrich A. Hayek",
    year: 1944,
    front: "Instituições",
    level: "Intermediário",
    note: "Por que o planejamento central da economia acaba cobrando o preço da liberdade política.",
    download: {
      url: "https://edisciplinas.usp.br/pluginfile.php/4065188/mod_resource/content/1/hayek-ocaminhodaservidao.pdf",
      language: "Português",
      source: "Instituto Liberal e OrdemLivre, via USP",
      edition: "5ª edição do Instituto Liberal, autorizada para leitura online",
    },
  },
  {
    title: "O Espírito das Leis",
    author: "Montesquieu",
    year: 1748,
    front: "Instituições",
    level: "Avançado",
    note: "A base da separação de poderes que as constituições modernas adotaram.",
  },
  {
    title: "Da Democracia na América",
    author: "Alexis de Tocqueville",
    year: 1835,
    front: "Instituições",
    level: "Intermediário",
    note: "Como associações livres e governo local sustentam uma democracia, e o que a ameaça.",
  },
  {
    title: "Segundo Tratado sobre o Governo",
    author: "John Locke",
    year: 1689,
    front: "Filosofia",
    level: "Intermediário",
    note: "Vida, liberdade e propriedade como direitos que existem antes de qualquer governo.",
  },
  {
    title: "Por uma Nova Liberdade",
    author: "Murray N. Rothbard",
    year: 1973,
    front: "Filosofia",
    level: "Intermediário",
    note: "O manifesto libertário: os princípios e a aplicação deles a problemas concretos.",
    download: {
      url: "https://mises.org/library/book/new-liberty-libertarian-manifesto",
      language: "Inglês",
      source: "Mises Institute",
      edition: "For a New Liberty",
    },
  },
  {
    title: "A Ética da Liberdade",
    author: "Murray N. Rothbard",
    year: 1982,
    front: "Filosofia",
    level: "Avançado",
    note: "Uma teoria dos direitos de propriedade construída a partir da posse de si mesmo.",
  },
  {
    title: "Capitalismo e Liberdade",
    author: "Milton Friedman",
    year: 1962,
    front: "Educação",
    level: "Intermediário",
    note: "Traz a proposta original dos vouchers escolares, entre outras ideias de política pública.",
  },
  {
    title: "Livre para Escolher",
    author: "Milton e Rose Friedman",
    year: 1980,
    front: "Educação",
    level: "Iniciante",
    note: "Uma defesa acessível da escolha individual na educação, no consumo e no trabalho.",
  },
  {
    title: "A Mentalidade Anticapitalista",
    author: "Ludwig von Mises",
    year: 1956,
    front: "Empreendedorismo",
    level: "Iniciante",
    note: "Por que tanta gente desconfia do mercado que melhora a vida dela.",
  },
  {
    title: "Competição e Atividade Empresarial",
    author: "Israel M. Kirzner",
    year: 1973,
    front: "Empreendedorismo",
    level: "Avançado",
    note: "O empreendedor como quem percebe oportunidades que o mercado ainda não viu.",
  },
];
