// The Liga's first articles, installed by the core seed so the site does not start empty. They are original texts about
// well-known ideas, signed by the team, and belong to the Liga like any article written in the dashboard.

export type SeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  front: string; // front name
  daysAgo: number; // published this many days before the seed runs, so the list is not all one date
  body: string;
};

/** Byline of the seeded articles. */
export const ARTICLE_BYLINE = "Equipe da Liga";

/** Older versions of the seed signed these "(exemplo)". The seed upgrades rows still carrying that signature. */
export const LEGACY_BYLINE_SUFFIX = "(exemplo)";

export const articles: SeedArticle[] = [
  {
    slug: "por-que-os-precos-importam",
    title: "Por que os preços importam",
    excerpt: "Um preço parece só um número na etiqueta, mas carrega informação que ninguém conseguiria reunir sozinho.",
    front: "Economia",
    daysAgo: 21,
    body: `Quando o preço do café sobe, ninguém precisa explicar a ninguém por quê. Pode ter havido geada numa lavoura, uma quebra de safra em outro país ou um aumento na procura. O consumidor não sabe qual foi a causa, e não precisa saber: o preço já diz o que importa, que o café está mais escasso e que vale a pena economizar.

## Informação que ninguém reúne sozinho

Em 1945, o economista Friedrich Hayek publicou o ensaio *O uso do conhecimento na sociedade*. A ideia central é simples: o conhecimento necessário para produzir e distribuir bens está espalhado entre milhões de pessoas, e cada uma sabe só um pedaço. O dono do armazém sabe o que sai rápido. O produtor sabe o que a terra rende. O motorista sabe qual estrada está bloqueada. Ninguém tem o quadro completo, e nenhum comitê conseguiria juntá-lo a tempo.

Os preços resumem esse conhecimento disperso num sinal que qualquer um consegue ler. No exemplo do próprio Hayek, quando o estanho fica mais escasso o preço sobe, e quem usa estanho passa a economizar sem precisar saber o motivo. Milhares de pessoas coordenam o que fazem sem se conhecer, guiadas por um número.

## O preço também aponta o caminho

O sinal não serve só para quem compra. Um preço alto avisa quem produz que há demanda não atendida, e atrai mais gente e mais investimento para aquele setor. Um preço em queda avisa o contrário. É por isso que o preço funciona ao mesmo tempo como informação e como incentivo.

## O que acontece quando o sinal é apagado

Um preço controlado deixa de dizer a verdade sobre a escassez. Se o governo fixa um preço abaixo do que o mercado pagaria, a procura aumenta e a oferta diminui, e o resultado costuma ser a falta do produto. Se fixa acima, costuma sobrar. Nos dois casos, o sinal que orientava produtores e consumidores foi apagado.

O Brasil conhece o roteiro. Em 1986, o Plano Cruzado congelou preços para conter a inflação. Em poucos meses, produtos como carne e leite sumiram das prateleiras, e passou a haver cobrança de ágio, um valor extra por fora da etiqueta. O preço oficial ficou no papel, e o preço real passou a ser negociado longe dos olhos de todos.

Isso não quer dizer que todo preço seja justo, nem que ninguém deva discutir política de preços. Quer dizer que, antes de mexer num preço, vale perguntar que informação ele estava carregando.

## Para pensar

- Que preço você viu mudar recentemente? O que ele pode estar dizendo?
- Quem ganha e quem perde quando um preço é congelado?
- Existe algum caso em que valeria apagar o sinal do preço? Que custo você aceitaria pagar?

## Para ler

- Friedrich Hayek, *O uso do conhecimento na sociedade* (1945).
- Henry Hazlitt, *Economia numa única lição*, que apresenta o raciocínio sobre preços e custos em linguagem acessível.`,
  },
  {
    slug: "a-janela-quebrada",
    title: "A janela quebrada: o que se vê e o que não se vê",
    excerpt: "A parábola de Bastiat mostra por que olhar só para o que é visível leva a conclusões erradas sobre custos e empregos.",
    front: "Economia",
    daysAgo: 14,
    body: `Em 1850, o economista francês Frédéric Bastiat contou a história de um comerciante cujo filho quebra uma vidraça. Os vizinhos, solidários, comentam que no fundo foi bom: o vidraceiro vai ganhar um serviço, vai gastar o dinheiro com outras coisas, e a economia gira. Na história, o conserto custa seis francos.

## O que se vê e o que não se vê

O que se vê é o vidraceiro recebendo os seis francos. O que não se vê é o que o comerciante teria feito com esse dinheiro se a vidraça estivesse inteira: comprar um par de sapatos, por exemplo, e dar trabalho ao sapateiro. No fim, a cidade tem um vidraceiro com seis francos a mais e um sapateiro com seis francos a menos, e o comerciante ficou com uma vidraça nova no lugar dos sapatos que queria.

Repare no que mudou de fato: a cidade perdeu uma vidraça. Destruir riqueza nunca a cria. O conserto apenas devolve o que existia antes, e ainda tira do comerciante a chance de usar o dinheiro em outra coisa.

## Por que isso importa

A lição vai muito além da vidraça. Quando alguém defende uma obra, um subsídio ou uma proteção pelos empregos que ela cria, os empregos aparecem na foto: têm nome, rosto e inauguração. Os que deixaram de existir porque o dinheiro saiu de outro lugar não aparecem em foto nenhuma, e por isso são fáceis de ignorar.

Sempre que alguém defender uma despesa pelos empregos que ela cria, vale perguntar: e o que deixou de ser criado porque o dinheiro foi gasto aqui? A pergunta vale para gastos públicos e privados. Ela não responde sozinha se um gasto é bom ou ruim, mas obriga a olhar para o custo completo.

## Para pensar

- Que notícia recente defendeu uma medida pelos empregos que ela gera? O que ficou fora da conta?
- Existe alguma situação em que o que “não se vê” é pequeno demais para importar?
- Que benefício de uma política seria fácil de ver, e que custo seria fácil de esquecer?

## Para ler

- Frédéric Bastiat, *O que se vê e o que não se vê* (1850).`,
  },
  {
    slug: "separacao-de-poderes-em-poucas-palavras",
    title: "Separação de poderes, em poucas palavras",
    excerpt: "Por que dividir o poder em três partes e fazer cada uma vigiar as outras continua sendo uma boa ideia.",
    front: "Instituições",
    daysAgo: 9,
    body: `A ideia de que o poder precisa de limites é antiga, mas ganhou forma clássica em 1748, com *O Espírito das Leis*, de Montesquieu. Para ele, quem tem poder tende a abusar dele até encontrar um limite, e o melhor limite para um poder é outro poder.

## Três funções, três mãos

Montesquieu separou o poder do Estado em três funções: fazer as leis, executá-las e julgar quem as descumpre. Quando todas ficam nas mesmas mãos, não há ninguém para dizer ao governante que ele errou. Quando ficam em mãos diferentes, cada uma pode barrar os excessos das outras, o que hoje se costuma chamar de freios e contrapesos.

Os autores do *Federalista*, que defenderam a Constituição americana, levaram a ideia adiante com um argumento realista: se os homens fossem anjos, não haveria necessidade de governo. Como não são, é preciso organizar o poder de modo que a ambição de uns sirva para conter a de outros.

## E no Brasil?

A Constituição de 1988 adotou o modelo logo no artigo 2º: “São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário”. A palavra “harmônicos” importa: a separação não pede que os poderes se ignorem, e sim que cooperem sem que um absorva o outro.

## O que a teoria não resolve

A separação de poderes é um princípio, não um manual. Ela não diz, sozinha, onde fica a fronteira exata entre o que o Legislativo decide e o que o Judiciário interpreta, e é justamente esse tipo de fronteira que gera debate. Entender o princípio ajuda a fazer a pergunta certa: nesse caso, quem está limitando quem, e quem limita quem está limitando?

## Para pensar

- Que exemplo recente fez você pensar em freios e contrapesos?
- O que aconteceria numa universidade ou associação em que a mesma pessoa cria as regras, aplica e julga?
- Um poder que nunca é contestado por outro tende a se comportar como?

## Para ler

- Montesquieu, *O Espírito das Leis* (1748), especialmente o livro sobre a constituição da Inglaterra.
- Madison, Hamilton e Jay, *O Federalista*, nos artigos sobre a divisão dos poderes.`,
  },
  {
    slug: "o-dinheiro-deve-seguir-o-aluno",
    title: "O dinheiro deve seguir o aluno?",
    excerpt: "A proposta de Milton Friedman para financiar a educação sem que o Estado precise ser o dono das escolas, com os argumentos dos dois lados.",
    front: "Educação",
    daysAgo: 3,
    body: `Em 1955, o economista Milton Friedman publicou um ensaio propondo uma separação: o Estado pode continuar financiando a educação sem precisar ser o dono e o gestor das escolas. Ele voltaria ao tema no livro *Capitalismo e liberdade*, de 1962. A ideia ficou conhecida como *voucher* escolar: o dinheiro público acompanha o aluno, e a família escolhe a escola.

## O argumento a favor

Quem defende a proposta lembra que, hoje, quem pode pagar uma escola particular tem escolha, e quem não pode costuma ficar com a escola do bairro. Com o dinheiro seguindo o aluno, dizem, famílias de qualquer renda poderiam escolher, e escolas que atendem mal perderiam alunos e recursos, o que as pressionaria a melhorar. Também apontam que escolas pequenas e novas poderiam surgir, já que o financiamento não dependeria de uma vaga reservada num prédio público.

## O argumento contra

Quem critica teme que escolas mais procuradas selecionem os melhores alunos e deixem os mais difíceis de atender nas escolas que sobrarem. Também lembram que famílias nem sempre têm como avaliar a qualidade de uma escola, e que, em cidades pequenas, pode não existir mais de uma opção. Outra objeção é que escola pública não é só um serviço: seria também um espaço comum, onde crianças de origens diferentes se encontram.

## O que os países fizeram

O Chile adotou um sistema em que o financiamento acompanha o aluno em 1981, e a Suécia fez uma reforma parecida em 1992. Os resultados são debatidos até hoje, e dependem de detalhes: quem pode escolher, como as escolas são avaliadas, se podem selecionar alunos e se podem cobrar a mais. Quem olha para os dois casos encontra argumentos para os dois lados, o que é um bom motivo para olhar os dados com calma, e não só os slogans.

## Para pensar

- Que informação uma família precisaria ter para escolher bem uma escola?
- Como desenhar um sistema que preserve a escolha sem aprofundar desigualdades?
- Se a escola pública é também um espaço comum, o que se ganha e o que se perde ao deixar o aluno escolher?

## Para ler

- Milton Friedman, *Capitalismo e liberdade*, capítulo sobre o papel do governo na educação.`,
  },
  {
    slug: "o-que-e-propriedade-e-por-que-vem-antes-da-lei",
    title: "O que é propriedade, e por que ela vem antes da lei?",
    excerpt: "Uma leitura introdutória do capítulo sobre propriedade do Segundo Tratado de Locke.",
    front: "Filosofia",
    daysAgo: 6,
    body: `Quando falamos em propriedade, quase sempre pensamos em escritura, registro e contrato. Mas para John Locke, que escreveu o *Segundo Tratado sobre o Governo* e o publicou em 1689, a propriedade começa antes de qualquer documento.

## A ideia de Locke

Para ele, cada pessoa é dona de si mesma, e portanto do próprio trabalho. Quando alguém mistura o seu trabalho com algo que a natureza deixou disponível, como colher uma fruta ou cultivar um terreno sem dono, aquilo passa a ser dele. A propriedade nasce do trabalho, e o governo existe, entre outras razões, para proteger o que as pessoas já têm: a vida, a liberdade e os bens, que Locke reunia na palavra “propriedade”.

É isso que quer dizer “antes da lei”. Para Locke, o registro e o contrato não criam o direito: reconhecem e protegem um direito que já existia. Um governo que ignora a propriedade dos cidadãos perde parte da razão de existir.

## Os limites que ele mesmo põe

Locke não defende que cada um possa acumular o quanto quiser. No mesmo capítulo, ele fala em deixar “o bastante e de igual qualidade” para os outros e em não desperdiçar o que se toma, já que de nada serve colher mais frutas do que se consegue comer antes de apodrecerem. Esses limites são tema de debate entre os leitores dele até hoje.

## Uma objeção famosa

No século XX, o filósofo Robert Nozick perguntou: se alguém derrama uma lata de suco de tomate no mar, ele passa a ser dono do mar, ou simplesmente perdeu o suco? A pergunta mostra que “misturar trabalho” com algo não resolve sozinha o que se torna propriedade e o que não, e que a teoria de Locke precisa de mais critérios do que a primeira leitura sugere.

## Para pensar

- Você concorda que a propriedade vem antes da lei? Por quê?
- Que limites você colocaria ao que alguém pode possuir?
- O trabalho é a melhor origem para a propriedade? Que outras origens você consideraria?

## Para ler

- John Locke, *Segundo Tratado sobre o Governo*, capítulo V, “Da propriedade”.
- Robert Nozick, *Anarquia, Estado e Utopia* (1974), para a objeção do suco de tomate.`,
  },
  {
    slug: "abrir-uma-empresa-no-brasil-anotacoes",
    title: "Abrir uma empresa no Brasil: o que a Lei de Liberdade Econômica mudou",
    excerpt: "Um guia introdutório sobre as etapas para abrir um negócio e sobre a lei de 2019 que quis tirar burocracia do caminho de quem empreende.",
    front: "Empreendedorismo",
    daysAgo: 1,
    body: `Quem decide abrir um pequeno negócio costuma descobrir, antes da primeira venda, que existe um caminho de papéis a percorrer: registro, inscrições, licenças, alvarás. Cada etapa tem uma razão de ser, mas somadas elas podem pesar mais para quem está começando, que tem menos dinheiro e menos tempo para esperar.

## As etapas, em linhas gerais

O caminho varia conforme o tipo de empresa, a atividade e a cidade, mas costuma passar por estas etapas:

- **Escolher a forma jurídica.** O microempreendedor individual (MEI) é a forma mais simples, para quem trabalha por conta própria com faturamento pequeno. Acima disso, há a microempresa e as sociedades.
- **Registrar a empresa e obter o CNPJ.** O registro passa por órgãos como a Junta Comercial e a Receita Federal. A Redesim é a rede criada para integrar esses órgãos e simplificar o processo.
- **Obter as inscrições e licenças da atividade.** É aqui que entram o alvará de funcionamento, a vigilância sanitária, o corpo de bombeiros e outras exigências, que variam conforme o que a empresa faz e onde fica.

Os prazos, os custos e as exigências mudam de cidade para cidade. Antes de começar, vale conferir o passo a passo no portal oficial do governo e na prefeitura do município.

## O que a Lei de Liberdade Econômica mudou

Em 2019, a Lei nº 13.874, conhecida como Lei de Liberdade Econômica, tentou reduzir a burocracia para quem empreende. Entre outras mudanças:

- Atividades classificadas como de **baixo risco** passaram a poder ser exercidas **sem a exigência de atos públicos de liberação**, como alvarás e licenças, o que alivia a espera de quem abre um negócio simples.
- Foi criada a **sociedade limitada unipessoal**, que permite a uma única pessoa constituir uma sociedade, sem precisar de um sócio apenas para preencher a exigência.
- Foram previstas garantias para quem pede autorização ao poder público, como a **aprovação tácita** em certos casos em que o órgão não responde dentro do prazo.
- A lei reforçou a ideia de que, na dúvida, a interpretação deve favorecer a **liberdade econômica**, com o poder público devendo justificar as restrições que impõe.

Os detalhes dependem de regulamentação, e cada município e estado tem o seu papel. A lei abriu espaço; quanto desse espaço chega ao dia a dia de quem empreende varia.

## O debate

Quem defende a desburocratização lembra que cada exigência a mais afasta quem não tem dinheiro para contratar um despachante, e que isso empurra pequenos negócios para a informalidade. Quem defende cautela lembra que alvarás e licenças existem por motivos reais, como segurança, saúde e meio ambiente, e que simplificar não pode significar abrir mão deles. A pergunta útil é qual exigência protege alguém de verdade e qual só consome tempo.

## Para pensar

- Que etapa do processo de abrir uma empresa você acha que poderia ser simplificada, e qual deveria ser mantida? Por quê?
- Quem é mais prejudicado por uma burocracia pesada: uma grande empresa ou um pequeno empreendedor?
- Como medir se uma exigência está protegendo alguém?

## Para ler

- Lei nº 13.874, de 20 de setembro de 2019, a Lei de Liberdade Econômica, no portal da legislação do Planalto.`,
  },
];
