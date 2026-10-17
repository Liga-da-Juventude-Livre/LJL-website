# Liga da Juventude Livre

Site público e painel privado da Liga. Next.js 16 (App Router), Prisma 7 e PostgreSQL no Neon.

## Começando

```bash
npm install                 # também gera o cliente do Prisma
cp .env.example .env        # preencha com as strings do Neon e o primeiro administrador
npm run db:deploy           # cria as tabelas no Neon
npm run db:seed             # frentes, diretório PUC-Rio, 16 livros, trilhas, 6 artigos de exemplo e o primeiro administrador
npm run db:seed:demo        # (só em desenvolvimento) além disso, logins de exemplo com senha compartilhada
npm run dev                 # http://localhost:3000  ·  painel em /dashboard
```

No Neon (Connect), há duas strings. A **com pooler** (host com `-pooler`) vai em `DATABASE_URL` e é a que o app usa.
A **direta** vai em `DIRECT_URL` e só serve para migrações e seed. Em produção (Vercel), configure apenas `DATABASE_URL`.

O primeiro acesso usa o e-mail e a senha do `.env` e já pede para trocar a senha.

| Comando | O que faz |
|---|---|
| `npm run db:migrate` | cria uma nova migração a partir de mudanças no `schema.prisma` (desenvolvimento) |
| `npm run db:deploy` | aplica as migrações pendentes (produção) |
| `npm run db:seed` | núcleo (frentes, diretório, biblioteca, administrador) mais artigos e cursos de exemplo; pode rodar de novo, só cria o que falta e nunca sobrescreve edições |
| `npm run db:seed:core` | só o núcleo, sem artigos nem cursos de exemplo |
| `npm run db:seed:demo` | além disso, cria os logins de exemplo (veja abaixo) |
| `npm run db:samples:clear` | remove os dados de exemplo; a biblioteca e o administrador real ficam, e artigos que a equipe reassinou também |
| `node scripts/covers.mjs add <slug> <imagem>` | normaliza uma capa de livro e atualiza o índice (veja "Capas") |
| `npm run db:studio` | abre o Prisma Studio |
| `npm run lint` · `npm run build` | verificações |

## Como o código está organizado

```
prisma/            schema, migrações e seed (seed/ = núcleo e exemplos; clear-samples.ts)
assets/            fontes do PDF (fonts/) e capas dos livros (books/covers/)
scripts/           ferramentas de linha de comando (covers.mjs)
lib/               db.ts (cliente), slug, datas, helpers de formulário
modules/           uma pasta por assunto; cada uma com schemas, queries, actions e ui
  auth/            senha, sessão, permissões, login
  posts/           artigos e notícias (mesma tabela, mesmo fluxo)
  books/           livros e edições gratuitas
  events/ chapters/ users/ activity/ overview/ fronts/
  chapter-requests/ pedidos de diretório: formulário público, caixa de entrada da equipe e contador de interesse
  courses/         cursos e trilhas de leitura: aulas, perguntas, tarefa e ordem das aulas
  certificates/    certificados: emissão em lote, código, PDF com QR e página de verificação
components/dashboard/ peças de interface compartilhadas pelo painel
app/dashboard/        rotas do painel, finas: só chamam os módulos
app/               site público
content/           textos fixos do site (frentes, linha do tempo, kit de diretório) e a lista inicial de livros usada pelo seed
proxy.ts           primeira barreira: sem cookie de sessão, vai para o login
```

Para criar um assunto novo (por exemplo, "podcast"): adicione o model no `schema.prisma`, rode `db:migrate`, crie `modules/podcast/`
com `schemas.ts`, `queries.ts`, `actions.ts` e `ui/`, e adicione as rotas em `app/dashboard/(app)/podcast/`. Toda página e toda action
começa com `requireUser()` ou `requireRole(...)`.

## Convenção de nomes

Tudo que é código está em inglês: rotas (`/articles`, `/library`, `/dashboard/books`), pastas, arquivos, componentes, classes CSS, ids e
variáveis. Só o que aparece na tela fica em português.

## Modelo de dados

`User` e `Session` (acesso) · `Chapter` (diretório) · `Front` (frente) · `Post` (artigo ou notícia) · `Book` e `BookDownload` ·
`Event` · `ChapterRequest` (pedido de diretório) · `Course` e `Lesson` (cursos e trilhas) · `Certificate` · `ActivityLog` (quem fez o quê). Comentários explicando cada campo estão no `prisma/schema.prisma`.

## Perfis

| Perfil | Pode |
|---|---|
| Administrador | tudo, inclusive criar contas e mudar perfis |
| Editor | todo o conteúdo (posts, livros, eventos, diretórios) e publicar |
| Autor | escrever artigos e notícias; salva rascunho e envia para revisão, mas não publica; só vê e edita os próprios textos |

As regras estão em `modules/auth/permissions.ts` e valem no servidor, não só no menu.

## Segurança do painel

- Senhas com scrypt e sal individual; mínimo de 10 caracteres.
- Sessão no banco: o navegador guarda um token aleatório (cookie `httpOnly`, `sameSite=lax`, válido por 14 dias) e o banco guarda só o hash dele.
- Desativar uma conta, redefinir a senha dela ou trocar a própria senha derruba as sessões abertas.
- Conta nova ou senha redefinida pelo administrador é provisória: a pessoa é obrigada a trocar no primeiro acesso.
- 5 senhas erradas bloqueiam a conta por 15 minutos. A mensagem de erro é sempre a mesma, para não revelar quais e-mails existem. O bloqueio é por conta, não por IP.
- Sempre sobra pelo menos um administrador ativo, e um administrador não consegue se rebaixar nem se desativar.
- Links de download só aceitam `https`, e cada um guarda a data em que alguém conferiu que é gratuito e autorizado pelo editor.
- `/dashboard` não é indexado, não é cacheado e não pode ser aberto em iframe.

## Pedidos de diretório (`/chapters`)

É o único lugar em que o público grava no banco, então é bem restrito: todos os campos validados e com limite de tamanho, campo-armadilha
contra robôs, no máximo 5 pedidos por hora por IP e 2 por dia por e-mail, e nenhum e-mail é enviado a partir do formulário.

- O **contador público de interesse só conta pedidos que a equipe já respondeu** (situação "Em contato" ou "Diretório iniciado"). Spam não infla o número.
- É dado pessoal: o formulário pede consentimento, o painel permite excluir o pedido, e o registro de atividades guarda a universidade, nunca o nome.
- Do IP guardamos só um hash, para a limitação de pedidos. Defina `IP_HASH_SALT` em produção.
- Ainda **não há aviso por e-mail** quando chega um pedido: a equipe vê o contador "Pedidos de diretório novos" na visão geral do painel.
- Falta uma página de política de privacidade; vale criar antes de divulgar o formulário.

## Cursos e trilhas (`/courses`)

Trilha de leitura é um curso cujas aulas são leituras; os dois usam a mesma estrutura. Cada aula pode apontar para um livro da biblioteca,
e a página do curso mostra "Baixar grátis" quando o livro tem uma edição **conferida** (nunca uma não conferida).

- **Não há conta de estudante.** Quem estuda marca as aulas concluídas e isso fica só no navegador da pessoa (`localStorage`). Nada é enviado ao servidor.
- Só cursos **Publicados** aparecem no site. A trilha "Primeiro mês" é publicada pelo seed padrão como exemplo (com `db:seed:core` ela fica como **rascunho**): as perguntas e tarefas são um ponto de partida para a equipe revisar.
- O texto das aulas é Markdown e passa por `lib/markdown.ts`: HTML bruto aparece como texto e só links `http(s)`, `mailto` e relativos são mantidos.
- Cursos têm "carga horária estimada", que é o número que um certificado futuro vai informar.

## Certificados (`/verify`)

A equipe emite pelo painel (**Certificados → Emitir**), para uma pessoa ou para várias de uma vez (uma por linha, com e-mail opcional). Escolher um curso ou
evento já preenche título, carga horária e tipo.

- Cada certificado tem um **código** como `LJL-7K2M-QX4D-9HWB` (12 caracteres aleatórios, cerca de 60 bits: não dá para adivinhar) e um **PDF** A4 com a tipografia da
  Liga e um **QR code** que aponta para `/verify/<código>`. O PDF é gerado na hora, a partir do banco, então uma correção de nome vale para o mesmo código.
- A página `/verify/<código>` mostra nome, atividade, carga horária e datas. **O e-mail nunca aparece.** Quem digita o código em `/verify` (maiúsculas, minúsculas, com ou sem
  traços) cai na página certa. As páginas de verificação não são indexadas.
- **Revogar** mantém o registro e a página passa a dizer que foi revogado (sem nome nem motivo). **Excluir** apaga o registro e os dados da pessoa. O registro de atividades
  guarda o nome da atividade, nunca o da pessoa.
- O texto diz que o documento **comprova a participação**, e que o aproveitamento como atividade complementar depende de cada instituição. Não prometa crédito de horas no site.
- Cursos têm o interruptor "emite certificado": quando marcado, quem termina todas as aulas vê como pedir o certificado por e-mail. Não há conta de estudante: a equipe confere e emite.
- **Em produção, defina `SITE_URL`** (o endereço público do site): é ele que vai dentro do QR code. As fontes do PDF estão em `assets/fonts` (licença OFL).

**Decisões da equipe** que o site ainda não tem: o critério para considerar um curso concluído, quem assina o certificado, e a identificação legal da Liga (por exemplo,
o CNPJ), que pode ser impressa no rodapé preenchendo `legalLine` em `content/site.ts`.

## Dados de exemplo

`npm run db:seed` já traz seis artigos (quatro publicados, um em revisão, um rascunho), a trilha "Primeiro mês" publicada e dois cursos de exemplo, para o site não ficar vazio.
Os artigos são textos educativos sobre ideias conhecidas (preços como sinais, a janela quebrada, separação de poderes, vouchers escolares, propriedade em Locke) e levam
"Equipe da Liga (exemplo)" na assinatura. Os cursos de exemplo não emitem certificado. Antes de divulgar o site, rode `npm run db:samples:clear`: ele apaga só o que o seed
criou e devolve "Primeiro mês" a rascunho. Se a equipe reassinou um artigo, ele é mantido.

### Logins de exemplo (`db:seed:demo`)

Só para desenvolvimento. Cria quatro logins (senha de todos: `liga-demo-2026`, ou o que estiver em `SEED_DEMO_PASSWORD`), distribui os artigos entre eles e liga o certificado nos cursos:

| Login | Perfil |
|---|---|
| `admin@liga.test` | Administrador |
| `editor@liga.test` | Editor |
| `autor@liga.test`, `autor2@liga.test` | Autor |

**Nunca rode isto num banco de verdade**: o comando recusa quando `NODE_ENV` ou `VERCEL_ENV` é `production`. `db:samples:clear` também remove esses logins.

## Imagens enviadas pelo painel (Vercel Blob)

Capas de artigos e de livros são enviadas pelo painel para o **Vercel Blob** (plano Hobby, gratuito e sem cartão; cerca de 1 GB). O navegador pede um token curto a
`/dashboard/api/uploads` (só quem está logado) e envia o arquivo direto ao Blob; o banco guarda o endereço da imagem (`coverUrl`). Sem o token, o painel continua funcionando
e os botões de envio ficam desativados.

1. Vercel → o projeto → **Storage** → **Create** → **Blob** → crie o store e conecte ao projeto (acesso **Public**). A Vercel cria sozinha a variável `BLOB_READ_WRITE_TOKEN`.
2. Para testar no seu computador, rode `vercel env pull` (ou copie o token para o `.env`).
3. Não há CORS nem domínio para configurar.

- Aceita JPEG, PNG e WebP de até 5 MB. O token emitido só vale para esses tipos e esse tamanho.
- Autores podem enviar imagens de artigos; capas de livros são só de Editor e Administrador.
- Trocar ou remover a imagem, ou excluir o artigo ou livro, apaga o arquivo antigo do Blob. Uma imagem enviada e depois abandonada sem salvar o formulário fica no Blob (ocupa pouco; dá para limpar em Storage → Blob).
- A capa de livro enviada vale mais que o arquivo em `assets/books/covers`. PDFs de livros **não** são enviados: só links de edições gratuitas e autorizadas (veja "Edições gratuitas").
- O limite gratuito é pequeno (1 GB); se um dia acabar, o caminho é o plano pago da Vercel ou trocar `lib/storage.ts` e `app/dashboard/api/uploads/route.ts` por outro serviço (o banco só guarda endereços).

## Capas dos livros (`assets/books/covers`)

Cada livro usa a capa original quando existe `assets/books/covers/<slug>.jpg` (o `slug` é o endereço do livro na biblioteca). Sem arquivo, o livro mostra uma capa desenhada
nas cores da Liga, então um livro cadastrado no painel nunca fica sem capa. Para adicionar ou trocar uma:

```bash
node scripts/covers.mjs add o-slug-do-livro caminho/da/capa.png            # converte para JPEG, no máximo 900 px de largura
node scripts/covers.mjs add o-slug-do-livro caminho/da/capa.png --trim     # também corta margens brancas em volta da arte
```

O índice (`index.ts`) é gerado, não edite à mão. De onde veio cada capa está em `assets/books/covers/CREDITS.md`: elas pertencem às editoras e servem para identificar os
livros recomendados; se uma editora pedir a retirada, apague o `.jpg` e rode `node scripts/covers.mjs index`.

## De onde o site público lê

- **Artigos** (`/articles`): os artigos **Publicados** no painel. Rascunhos e textos em revisão não aparecem.
- **Biblioteca** (`/library`): os livros **Publicados** no painel, com as edições gratuitas **conferidas**. Se o banco estiver fora do ar, a página usa a lista de `content/library.ts` em vez de falhar.
- **Cursos e trilhas** (`/courses`) e **diretórios** (`/chapters`): do banco.
- **Frentes, linha do tempo e kit de diretório**: ainda de `content/` (arquivos).
- Não existe página pública de notícias nem de eventos: o painel já cadastra os dois, falta a página.

Todo Markdown escrito por pessoas passa por `lib/markdown.ts` (HTML bruto vira texto, links perigosos são descartados). Reaproveite sempre `renderMarkdown`.
