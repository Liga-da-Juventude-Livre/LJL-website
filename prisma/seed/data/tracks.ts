// The reading track that ships with the project. The core seed creates it as a DRAFT: the questions and tasks are a
// starting point for the team to review. The demo seed publishes it.
export const primeiroMes = {
  slug: "primeiro-mes",
  title: "Primeiro mês",
  summary: "Quatro semanas, três livros curtos e perguntas para debater. A trilha para quem está começando a estudar liberdade.",
  description:
    "Esta trilha foi pensada para um primeiro mês de estudo. Em cada semana você lê um trecho, responde às perguntas por conta própria e faz uma tarefa curta.\n\nSe puder, faça em grupo: leiam o mesmo trecho e debatam as perguntas no encontro. Ninguém precisa concordar com ninguém.",
  kind: "TRACK" as const,
  level: "BEGINNER" as const,
  durationWeeks: 4,
  workloadHours: 12,
  lessons: [
    {
      title: "Semana 1: capitalismo, socialismo e intervencionismo",
      summary: "As três primeiras palestras de As Seis Lições.",
      estimatedMinutes: 180,
      book: "as-seis-licoes",
      questions: [
        "Segundo o autor, o que decide o que será produzido numa economia de mercado? E numa economia planejada?",
        "Pense num preço que você viu mudar. Que informação essa mudança carregava?",
        "Em que ponto você discorda do autor? Escreva a objeção em uma frase.",
      ],
      task: "Escreva um parágrafo explicando, com as suas palavras, a diferença entre capitalismo e socialismo segundo o autor. Leve para o encontro.",
    },
    {
      title: "Semana 2: inflação, investimento e ideias",
      summary: "As três últimas palestras de As Seis Lições.",
      estimatedMinutes: 180,
      book: "as-seis-licoes",
      questions: [
        "Por que o autor liga a inflação a decisões do governo?",
        "O que ele diz sobre o papel das ideias na política?",
        "Qual das seis palestras você levaria para um debate hoje, e por quê?",
      ],
      task: "Escolha uma das seis palestras e prepare uma pergunta de dois minutos para o grupo.",
    },
    {
      title: "Semana 3: A Lei",
      summary: "Um texto curto de Bastiat sobre o que a lei deve e não deve fazer.",
      estimatedMinutes: 150,
      book: "a-lei",
      questions: [
        "Para Bastiat, qual deve ser a função da lei?",
        "O que ele chama de espoliação legal? Discuta o conceito, não o partido de ninguém.",
        "Bastiat escreveu em 1850. Que partes do texto continuam atuais e quais soam datadas?",
      ],
      task: "Resuma o argumento central do texto em três frases.",
    },
    {
      title: "Semana 4: Economia numa Única Lição",
      summary: "Hazlitt ensina a olhar para os efeitos de uma medida no longo prazo e para todos os grupos, não só os mais visíveis.",
      estimatedMinutes: 240,
      book: "economia-numa-unica-licao",
      questions: [
        "Qual é a “única lição” do livro, nas palavras do autor?",
        "O que a parábola da janela quebrada ensina sobre custos que não se veem?",
        "Que mudança no seu jeito de ler notícias de economia essa lição provocaria?",
      ],
      task: "Escolha uma notícia recente sobre uma política pública e descreva o que se vê e o que não se vê nela. Descreva os efeitos, sem tomar partido.",
    },
  ],
};
