// Sample courses, created by the default seed (together with "Primeiro mês" from tracks.ts) so /courses is not empty.
// `npm run db:samples:clear` removes them.

export type SampleLesson = {
  title: string;
  summary?: string;
  estimatedMinutes?: number;
  book?: string; // library slug
  body?: string;
  questions: string[];
  task?: string;
};

export type SampleCourse = {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  kind: "TRACK" | "COURSE";
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  front: string;
  durationWeeks: number;
  workloadHours: number;
  /** Only applied with `--demo`: whether the Liga issues certificates is the team's decision, so by default it is off. */
  issuesCertificate: boolean;
  sortOrder: number;
  lessons: SampleLesson[];
};

export const sampleCourses: SampleCourse[] = [
  {
    slug: "instituicoes-e-liberdade",
    title: "Instituições e liberdade",
    summary: "Três semanas com três clássicos sobre como limitar o poder e proteger direitos: Locke, Montesquieu e Tocqueville.",
    description: "Uma trilha para quem já passou pelo primeiro mês e quer entender de onde vêm as ideias de direitos individuais, separação de poderes e associações livres.",
    kind: "TRACK",
    level: "INTERMEDIATE",
    front: "Instituições",
    durationWeeks: 3,
    workloadHours: 9,
    issuesCertificate: false,
    sortOrder: 1,
    lessons: [
      {
        title: "Semana 1: direitos antes do governo",
        summary: "O Segundo Tratado sobre o Governo, de John Locke.",
        estimatedMinutes: 180,
        book: "segundo-tratado-sobre-o-governo",
        questions: [
          "Que direitos Locke considera anteriores ao governo?",
          "Segundo o autor, por que as pessoas criam governos?",
          "Quando, para ele, um governo perde a legitimidade?",
        ],
        task: "Escreva em cinco linhas a diferença entre um governo que protege direitos e um que os concede.",
      },
      {
        title: "Semana 2: limitar o poder",
        summary: "O Espírito das Leis, de Montesquieu.",
        estimatedMinutes: 180,
        book: "o-espirito-das-leis",
        questions: [
          "Por que, segundo o autor, o poder precisa ser limitado por outro poder?",
          "Que risco ele vê quando legislar, executar e julgar se concentram nas mesmas mãos?",
          "Que partes do livro soam presas ao século XVIII e quais continuam atuais?",
        ],
        task: "Compare a ideia de Montesquieu com o artigo 2º da Constituição de 1988 em um parágrafo.",
      },
      {
        title: "Semana 3: associações e liberdade",
        summary: "Da Democracia na América, de Alexis de Tocqueville.",
        estimatedMinutes: 180,
        book: "da-democracia-na-america",
        questions: [
          "Que papel o autor dá às associações livres numa democracia?",
          "O que ele chama de despotismo brando, e por que o teme?",
          "Que associação da sua universidade faz algo que ninguém faria por ela?",
        ],
        task: "Descreva uma associação que você conhece e o que ela faz que o Estado não faria do mesmo jeito.",
      },
    ],
  },
  {
    slug: "economia-em-cinco-aulas",
    title: "Economia em cinco aulas curtas",
    summary: "Cinco ideias básicas de economia, em textos curtos com perguntas e uma tarefa em cada aula. Não precisa de conhecimento prévio.",
    kind: "COURSE",
    level: "BEGINNER",
    front: "Economia",
    durationWeeks: 1,
    workloadHours: 5,
    issuesCertificate: true,
    sortOrder: 2,
    lessons: [
      {
        title: "Aula 1: escassez e escolhas",
        estimatedMinutes: 40,
        body: `Os desejos das pessoas não têm fim, mas o tempo, o dinheiro e os recursos têm. Essa diferença se chama **escassez**, e é por causa dela que existe economia: se tudo sobrasse, ninguém precisaria escolher.

Toda escolha tem um **custo de oportunidade**: o valor da melhor alternativa que você deixou de lado. Se você passa a tarde estudando, o custo não é só o cansaço, é também o que você poderia ter feito com aquelas horas.`,
        questions: ["Qual foi a última escolha difícil que você fez? O que ficou de fora?", "Por que o custo de oportunidade pode ser maior do que o preço pago?"],
        task: "Anote três escolhas que você fez hoje e, para cada uma, o seu custo de oportunidade.",
      },
      {
        title: "Aula 2: preços como sinais",
        estimatedMinutes: 40,
        body: `Um preço não é só uma cobrança: é uma informação. Quando algo fica escasso, o preço sobe e avisa a quem compra que vale economizar e a quem vende que vale produzir mais.

Para uma leitura mais longa sobre o assunto, veja o artigo [Por que os preços importam](/articles/por-que-os-precos-importam).`,
        questions: ["Que informação o preço de um produto carrega além do valor a pagar?", "O que se perde quando um preço é fixado por decreto?"],
        task: "Escolha um produto que ficou mais caro ou mais barato e escreva o que essa mudança pode estar dizendo.",
      },
      {
        title: "Aula 3: trocas voluntárias",
        estimatedMinutes: 40,
        body: `Quando duas pessoas fazem uma troca por vontade própria, as duas esperam sair ganhando, senão não trocariam. Quem compra um pão vale mais o pão do que o dinheiro naquele momento, e o padeiro vale mais o dinheiro do que o pão.

É por isso que as trocas criam valor: a mesma quantidade de coisas passa a servir melhor a quem a recebe.`,
        questions: ["Dê um exemplo de troca em que os dois lados saíram ganhando.", "Quando uma troca deixa de ser voluntária, o que muda?"],
        task: "Descreva uma troca que você fez esta semana e o que cada lado ganhou.",
      },
      {
        title: "Aula 4: incentivos",
        estimatedMinutes: 40,
        body: `As pessoas respondem a incentivos. Num restaurante que cobra por quilo, o cliente se serve com mais cuidado, porque paga pelo que coloca no prato. Num rodízio, o preço é o mesmo qualquer que seja a quantidade, e o comportamento muda.

Regras bem-intencionadas podem ter efeitos que ninguém planejou, justamente porque as pessoas reagem a elas de formas diferentes das esperadas.`,
        questions: ["Que regra da sua universidade criou um incentivo, bom ou ruim?", "Como saber se uma regra produziu o efeito que se queria?"],
        task: "Escolha uma regra que você conhece e descreva o incentivo que ela cria.",
      },
      {
        title: "Aula 5: o que se vê e o que não se vê",
        estimatedMinutes: 40,
        body: `Toda decisão tem efeitos que aparecem de imediato e efeitos que só aparecem depois, ou em outras pessoas. Olhar só para os primeiros leva a conclusões apressadas.

A parábola da janela quebrada, de Bastiat, é o exemplo clássico. Leia o artigo [A janela quebrada](/articles/a-janela-quebrada) e responda às perguntas.`,
        questions: ["Qual é o custo que “não se vê” na parábola?", "Que mudança essa ideia provocaria no seu jeito de ler notícias?"],
        task: "Escolha uma notícia sobre uma medida pública e descreva o que se vê e o que não se vê nela, sem tomar partido.",
      },
    ],
  },
];
