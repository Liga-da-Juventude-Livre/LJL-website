// Sample articles, created by the default seed so the site is not empty. They are educational texts about well-known ideas,
// each signed "(exemplo)" so nobody mistakes them for real Liga content. `npm run db:samples:clear` removes them.

export type SampleArticle = {
  slug: string;
  title: string;
  excerpt: string;
  front: string; // front name
  /** Which sample login owns it when the demo logins are seeded (`--demo`); otherwise it has no owner. */
  author: "editor" | "autor" | "autor2";
  status: "PUBLISHED" | "IN_REVIEW" | "DRAFT";
  daysAgo?: number; // published this many days ago
  body: string;
};

export const sampleArticles: SampleArticle[] = [
  {
    slug: "por-que-os-precos-importam",
    title: "Por que os preços importam",
    excerpt: "Um preço parece só um número na etiqueta, mas carrega informação que ninguém conseguiria reunir sozinho.",
    front: "Economia",
    author: "editor",
    status: "PUBLISHED",
    daysAgo: 21,
    body: `Quando o preço do café sobe, ninguém precisa explicar a ninguém por quê. Pode ter havido geada numa lavoura, uma quebra de safra em outro país ou um aumento na procura. O consumidor não sabe qual foi a causa, e não precisa saber: o preço já diz o que importa, que o café está mais escasso e que vale a pena economizar.

## Informação que ninguém reúne sozinho

Em 1945, o economista Friedrich Hayek publicou o ensaio *O uso do conhecimento na sociedade*. A ideia central é simples: o conhecimento necessário para produzir e distribuir bens está espalhado entre milhões de pessoas, e cada uma sabe só um pedaço. O dono do armazém sabe o que sai rápido. O produtor sabe o que a terra rende. Ninguém tem o quadro completo.

Os preços resumem esse conhecimento disperso num sinal que qualquer um consegue ler. No exemplo do próprio Hayek, quando o estanho fica mais escasso o preço sobe, e quem usa estanho passa a economizar sem precisar saber o motivo.

## O que acontece quando o sinal é apagado

Um preço controlado deixa de dizer a verdade sobre a escassez. Se o governo fixa um preço abaixo do que o mercado pagaria, a procura aumenta e a oferta diminui, e o resultado costuma ser a falta do produto. Se fixa acima, costuma sobrar. Nos dois casos, o sinal que orientava produtores e consumidores foi apagado.

Isso não quer dizer que todo preço seja justo, nem que ninguém deva discutir política de preços. Quer dizer que, antes de mexer num preço, vale perguntar que informação ele estava carregando.

## Para pensar

- Que preço você viu mudar recentemente? O que ele pode estar dizendo?
- Quem ganha e quem perde quando um preço é congelado?`,
  },
  {
    slug: "a-janela-quebrada",
    title: "A janela quebrada: o que se vê e o que não se vê",
    excerpt: "A parábola de Bastiat mostra por que olhar só para o que é visível leva a conclusões erradas sobre custos e empregos.",
    front: "Economia",
    author: "autor",
    status: "PUBLISHED",
    daysAgo: 14,
    body: `Em 1850, o economista francês Frédéric Bastiat contou a história de um comerciante cujo filho quebra uma vidraça. Os vizinhos, solidários, comentam que no fundo foi bom: o vidraceiro vai ganhar um serviço, vai gastar o dinheiro com outras coisas, e a economia gira. Na história, o conserto custa seis francos.

## O que se vê e o que não se vê

O que se vê é o vidraceiro recebendo os seis francos. O que não se vê é o que o comerciante teria feito com esse dinheiro se a vidraça estivesse inteira: comprar um par de sapatos, por exemplo, e dar trabalho ao sapateiro. No fim, a cidade tem um vidraceiro com seis francos a mais e um sapateiro com seis francos a menos, e o comerciante ficou com uma vidraça nova no lugar dos sapatos que queria.

## Por que isso importa

A lição vai muito além da vidraça. Sempre que alguém defende uma despesa pelos empregos que ela cria, vale perguntar: e o que deixou de ser criado porque o dinheiro foi gasto aqui? A pergunta vale para gastos públicos e privados. Ela não responde sozinha se um gasto é bom ou ruim, mas obriga a olhar para o custo completo.

## Para pensar

- Que notícia recente defendeu uma medida pelos empregos que ela gera? O que ficou fora da conta?
- Existe alguma situação em que o que “não se vê” é pequeno demais para importar?`,
  },
  {
    slug: "separacao-de-poderes-em-poucas-palavras",
    title: "Separação de poderes, em poucas palavras",
    excerpt: "Por que dividir o poder em três partes e fazer cada uma vigiar as outras continua sendo uma boa ideia.",
    front: "Instituições",
    author: "autor2",
    status: "PUBLISHED",
    daysAgo: 9,
    body: `A ideia de que o poder precisa de limites é antiga, mas ganhou forma clássica em 1748, com *O Espírito das Leis*, de Montesquieu. Para ele, quem tem poder tende a abusar dele até encontrar um limite, e o melhor limite para um poder é outro poder.

## Três funções, três mãos

Montesquieu separou o poder do Estado em três funções: fazer as leis, executá-las e julgar quem as descumpre. Quando todas ficam nas mesmas mãos, não há ninguém para dizer ao governante que ele errou. Quando ficam em mãos diferentes, cada uma pode barrar os excessos das outras, o que hoje se costuma chamar de freios e contrapesos.

## E no Brasil?

A Constituição de 1988 adotou o modelo logo no artigo 2º: “São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário”. A palavra “harmônicos” importa: a separação não pede que os poderes se ignorem, e sim que cooperem sem que um absorva o outro.

## O que a teoria não resolve

A separação de poderes é um princípio, não um manual. Ela não diz, sozinha, onde fica a fronteira exata entre o que o Legislativo decide e o que o Judiciário interpreta, e é justamente esse tipo de fronteira que gera debate. Entender o princípio ajuda a fazer a pergunta certa: nesse caso, quem está limitando quem?

## Para pensar

- Que exemplo recente fez você pensar em freios e contrapesos?
- O que aconteceria numa universidade ou associação em que a mesma pessoa cria as regras, aplica e julga?`,
  },
  {
    slug: "o-dinheiro-deve-seguir-o-aluno",
    title: "O dinheiro deve seguir o aluno?",
    excerpt: "A proposta de Milton Friedman para financiar a educação sem que o Estado precise ser o dono das escolas, com os argumentos dos dois lados.",
    front: "Educação",
    author: "editor",
    status: "PUBLISHED",
    daysAgo: 3,
    body: `Em 1955, o economista Milton Friedman publicou um ensaio propondo uma separação: o Estado pode continuar financiando a educação sem precisar ser o dono e o gestor das escolas. A ideia ficou conhecida como *voucher* escolar: o dinheiro público acompanha o aluno, e a família escolhe a escola.

## O argumento a favor

Quem defende a proposta lembra que, hoje, quem pode pagar uma escola particular tem escolha, e quem não pode costuma ficar com a escola do bairro. Com o dinheiro seguindo o aluno, dizem, famílias de qualquer renda poderiam escolher, e escolas que atendem mal perderiam alunos e recursos, o que as pressionaria a melhorar.

## O argumento contra

Quem critica teme que escolas mais procuradas selecionem os melhores alunos e deixem os mais difíceis de atender nas escolas que sobrarem. Também lembram que famílias nem sempre têm como avaliar a qualidade de uma escola, e que, em cidades pequenas, pode não existir mais de uma opção.

## O que os países fizeram

Países como o Chile e a Suécia adotaram, em momentos diferentes, sistemas em que o financiamento acompanha o aluno. Os resultados são debatidos até hoje, e dependem de detalhes: quem pode escolher, como as escolas são avaliadas, se podem selecionar alunos e se podem cobrar a mais.

## Para pensar

- Que informação uma família precisaria ter para escolher bem uma escola?
- Como desenhar um sistema que preserve a escolha sem aprofundar desigualdades?`,
  },
  {
    slug: "o-que-e-propriedade-e-por-que-vem-antes-da-lei",
    title: "O que é propriedade, e por que ela vem antes da lei?",
    excerpt: "Uma leitura introdutória do capítulo sobre propriedade do Segundo Tratado de Locke.",
    front: "Filosofia",
    author: "autor",
    status: "IN_REVIEW",
    body: `Quando falamos em propriedade, quase sempre pensamos em escritura, registro e contrato. Mas para John Locke, que escreveu o *Segundo Tratado sobre o Governo* em 1689, a propriedade começa antes de qualquer documento.

## A ideia de Locke

Para ele, cada pessoa é dona de si mesma, e portanto do próprio trabalho. Quando alguém mistura o seu trabalho com algo que a natureza deixou disponível, como colher uma fruta ou cultivar um terreno sem dono, aquilo passa a ser dele. A propriedade nasce do trabalho, e o governo existe, entre outras razões, para proteger o que as pessoas já têm.

## Os limites que ele mesmo põe

Locke não defende que cada um possa acumular o quanto quiser. No mesmo capítulo, ele fala em deixar “o bastante e de igual qualidade” para os outros e em não desperdiçar o que se toma. Esses limites são tema de debate entre os leitores dele até hoje.

## Para pensar

- Você concorda que a propriedade vem antes da lei? Por quê?
- Que limites você colocaria ao que alguém pode possuir?`,
  },
  {
    slug: "abrir-uma-empresa-no-brasil-anotacoes",
    title: "Abrir uma empresa no Brasil: anotações para um artigo",
    excerpt: "Rascunho com o roteiro de um artigo sobre as etapas para abrir uma empresa.",
    front: "Empreendedorismo",
    author: "autor2",
    status: "DRAFT",
    body: `*Rascunho: este texto ainda não está pronto.*

## Roteiro

- Contar a história de alguém que quer abrir um pequeno negócio e descobre quantas etapas existem. (Precisa de uma entrevista de verdade.)
- Listar as etapas: registro, inscrições, alvarás, licenças. (Conferir cada uma na fonte oficial antes de escrever.)
- Explicar a Lei de Liberdade Econômica, a Lei 13.874, de 2019, e o que ela mudou para atividades de baixo risco. (Ler o texto da lei.)
- Comparar com a experiência de outros países. (Só citar números com fonte.)

## Pontos a pesquisar

- Quanto tempo leva abrir uma empresa hoje, segundo dados oficiais?
- Qual é a diferença entre MEI, microempresa e sociedade?`,
  },
];
