// Site copy in one place. Only facts the Liga can stand behind: add sections back
// (articles, news, council, numbers) once there is real material for them.

// Optional line printed on certificates under the disclaimer, e.g. "CNPJ 00.000.000/0001-00". Left empty until the Liga
// has the legal identification it wants on the document.
export const legalLine: string | undefined = undefined;

export const contactEmail = "ligadajuventudelivre@gmail.com";

// Links work from every page: home sections are addressed as "/#id".
export const nav = [
  { href: "/#fronts", label: "Frentes" },
  { href: "/library", label: "Biblioteca" },
  { href: "/courses", label: "Cursos" },
  { href: "/chapters", label: "Diretórios" },
  { href: "/articles", label: "Artigos" },
  { href: "/#get-involved", label: "Participe" },
  { href: "/#faq", label: "Perguntas" },
];

export const firstChapter = {
  university: "PUC-Rio",
  city: "Rio de Janeiro",
};

export const vision =
  "O futuro do Brasil não será decidido em gabinetes. Será construído por jovens que defendem a liberdade, a propriedade e a responsabilidade, com ideias sérias, estudo e coragem.";
export const visionKeywords = ["liberdade", "propriedade", "responsabilidade"];

// Each front has a question we take to debate and a pictogram the board's blocks rearrange into (see Fronts.tsx).
export const fronts = [
  {
    title: "Economia",
    text: "Mercado, preços, moeda e a lógica da ação humana.",
    question: "Por que controlar preços costuma gerar escassez?",
    shape: "economy",
  },
  {
    title: "Instituições",
    text: "Separação de poderes e limites ao poder do Estado.",
    question: "Quem fiscaliza quem fiscaliza?",
    shape: "institutions",
  },
  {
    title: "Educação",
    text: "Escolha escolar, vouchers e autonomia universitária.",
    question: "E se o dinheiro da escola seguisse o aluno?",
    shape: "education",
  },
  {
    title: "Direito",
    text: "Propriedade, contratos e devido processo legal.",
    question: "Até onde o Estado pode ir sem ferir o devido processo?",
    shape: "law",
  },
  {
    title: "Filosofia",
    text: "Os fundamentos éticos de uma sociedade livre.",
    question: "O que é de cada um antes de qualquer lei?",
    shape: "philosophy",
  },
  {
    title: "Empreendedorismo",
    text: "Menos burocracia para quem quer criar e contratar.",
    question: "Por que abrir uma empresa no Brasil ainda é tão difícil?",
    shape: "enterprise",
  },
] as const;

export const ways: { title: string; text: string; cta: string; href?: string }[] = [
  {
    title: "Entre no diretório da PUC-Rio",
    text: "Se você estuda na PUC-Rio, participe dos encontros, debates e grupos de estudo do primeiro diretório da Liga.",
    cta: "Quero participar",
    href: "/join",
  },
  {
    title: "Abra um diretório na sua universidade",
    text: "Ainda não estamos na sua faculdade? Fale com a gente e ajudamos a montar o diretório desde o primeiro encontro.",
    cta: "Quero abrir um diretório",
    href: "/chapters#interest",
  },
  {
    title: "Escreva com a gente",
    text: "Tem uma ideia de artigo sobre economia, instituições ou liberdade? Mande sua proposta para publicarmos no site.",
    cta: "Quero escrever",
    href: "/join?skills=writing&interests=content#candidatura",
  },
];

export const faq = [
  {
    q: "A Liga é ligada a algum partido?",
    a: "Não. A Liga da Juventude Livre é um movimento estudantil apartidário, focado em ideias e formação.",
  },
  {
    q: "Onde a Liga já está?",
    a: "Começamos na PUC-Rio, onde fica o nosso primeiro diretório. Queremos chegar a outras universidades com estudantes que topem abrir o seu.",
  },
  {
    q: "Como abrir um diretório na minha universidade?",
    a: "Escreva para nós com o nome da universidade e do seu curso. Conversamos sobre os primeiros passos.",
  },
  {
    q: "Posso escrever para o site?",
    a: "Sim. Envie a sua proposta de artigo por e-mail com um resumo de poucas linhas.",
  },
];

// Historical milestones for the timeline; the last entry is the Liga itself.
export const timeline = [
  { year: "1215", title: "Magna Carta", text: "Pela primeira vez, o poder do rei passa a ter limites escritos." },
  { year: "1689", title: "Locke", text: "Os Dois Tratados sobre o Governo defendem vida, liberdade e propriedade como direitos de cada um." },
  { year: "1748", title: "Montesquieu", text: "O Espírito das Leis propõe separar os poderes para que nenhum deles domine os outros." },
  { year: "1776", title: "Adam Smith", text: "A Riqueza das Nações mostra como trocas livres criam prosperidade." },
  { year: "1850", title: "Bastiat", text: "A Lei denuncia o Estado que usa a força para tirar de uns e dar a outros." },
  { year: "1888", title: "Lei Áurea", text: "O Brasil abole a escravidão, a negação mais radical da liberdade." },
  { year: "1944", title: "Hayek", text: "O Caminho da Servidão alerta para o preço do planejamento central." },
  { year: "1949", title: "Mises", text: "Ação Humana explica a economia a partir das escolhas de cada indivíduo." },
  { year: "1973", title: "Rothbard", text: "Por uma Nova Liberdade leva a defesa da liberdade individual às últimas consequências." },
  { year: "1989", title: "Queda do Muro", text: "Berlim derruba o muro, e o fim da Guerra Fria começa pelas ruas." },
  { year: "2019", title: "Lei de Liberdade Econômica", text: "A Lei 13.874 reduz a burocracia para quem quer empreender no Brasil." },
  { year: "2026", title: "Liga da Juventude Livre", text: "Nasce o primeiro diretório, na PUC-Rio. O próximo capítulo é escrito por estudantes." },
];
