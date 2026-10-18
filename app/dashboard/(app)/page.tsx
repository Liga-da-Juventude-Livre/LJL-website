import Link from "next/link";
import { Icon, type IconName } from "@/components/dashboard/icons";
import { Empty, PageHeader, dateTimeBR } from "@/components/dashboard/ui";
import { requireUser } from "@/modules/auth/dal";
import { POST_KINDS } from "@/modules/posts/config";
import { getOverview } from "@/modules/overview/queries";

export const metadata = { title: "Visão geral" };

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser();
  const [data, { denied }] = await Promise.all([getOverview(user), searchParams]);

  type Tile = { n: number; l: string; href: string; icon: IconName; attn?: boolean };
  const tiles: Tile[] = [
    { n: data.publishedArticles, l: "Artigos publicados", href: "/dashboard/articles?status=PUBLISHED", icon: "doc" },
    { n: data.publishedNews, l: "Notícias publicadas", href: "/dashboard/news?status=PUBLISHED", icon: "news" },
    { n: data.inReview, l: "Em revisão", href: "/dashboard/articles?status=IN_REVIEW", icon: "alert", attn: data.editor && data.inReview > 0 },
    { n: data.drafts, l: "Rascunhos", href: "/dashboard/articles?status=DRAFT", icon: "doc" },
    ...(data.editor
      ? ([
          { n: data.books, l: "Livros na biblioteca", href: "/dashboard/books", icon: "book" },
          { n: data.courses, l: "Cursos publicados", href: "/dashboard/courses", icon: "course" },
          { n: data.certificates, l: "Certificados válidos", href: "/dashboard/certificates", icon: "award" },
          { n: data.upcomingEvents, l: "Próximos eventos", href: "/dashboard/events", icon: "calendar" },
          { n: data.chapters, l: "Diretórios ativos", href: "/dashboard/chapters", icon: "building" },
          { n: data.newRequests, l: "Pedidos de diretório novos", href: "/dashboard/chapter-requests?status=NEW", icon: "inbox", attn: data.newRequests > 0 },
        ] as Tile[])
      : []),
    ...(data.canApplications
      ? ([
          { n: data.newApplications, l: "Candidaturas novas", href: "/dashboard/applications?status=NEW", icon: "userPlus", attn: data.newApplications > 0 },
          { n: data.endingSoon, l: "Mandatos terminando", href: "/dashboard/members", icon: "users", attn: data.endingSoon > 0 },
        ] as Tile[])
      : []),
    ...(user.role === "ADMIN" ? ([{ n: data.users, l: "Pessoas com acesso", href: "/dashboard/users", icon: "shield" }] as Tile[]) : []),
  ];
  const quick = [
    { href: "/dashboard/articles/new", label: "Novo artigo" },
    { href: "/dashboard/news/new", label: "Nova notícia" },
    ...(data.editor
      ? [
          { href: "/dashboard/events/new", label: "Novo evento" },
          { href: "/dashboard/certificates/new", label: "Emitir certificados" },
        ]
      : []),
    ...(data.canApplications ? [{ href: "/dashboard/members/new", label: "Novo membro" }] : []),
  ];
  // Hour in Brasília, for the greeting.
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "America/Sao_Paulo" }).format(new Date()));
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <PageHeader title={`${greeting}, ${user.name.split(" ")[0]}`} subtitle={data.editor ? "O que está acontecendo na Liga." : "Seus textos."} />
      {denied && (
        <p className="dash-alert dash-alert-warn" role="status">
          Você não tem acesso a essa página.
        </p>
      )}
      <div className="dash-stack">
        <div>
          <p className="dash-section-title">Atalhos</p>
          <div className="dash-quick">
            {quick.map((q) => (
              <Link key={q.href} href={q.href} className="dash-btn dash-btn-ghost">
                <Icon name="plus" size={16} />
                {q.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="dash-stats">
          {tiles.map((t) => (
            <Link key={t.l} href={t.href} className={`dash-stat${t.attn ? " dash-stat-attn" : ""}`}>
              <span className="dash-stat-n">{t.n}</span>
              <Icon name={t.icon} />
              <span className="dash-stat-l">{t.l}</span>
            </Link>
          ))}
        </div>

        <div className="dash-cols">
          <section className="dash-card">
            <h2>{data.editor ? "Aguardando revisão" : "Seus textos em revisão"}</h2>
            {data.awaiting.length === 0 ? (
              <Empty title="Nada na fila">Textos enviados para revisão aparecem aqui.</Empty>
            ) : (
              <ul className="dash-list">
                {data.awaiting.map((p) => (
                  <li key={p.id}>
                    <span>
                      <Link href={`${POST_KINDS[p.type].path}/${p.id}`} className="dash-title">
                        {p.title}
                      </Link>
                      <br />
                      <span className="dash-sub">{p.authorName}</span>
                    </span>
                    <time>{dateTimeBR(p.updatedAt)}</time>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {data.editor && (
            <section className="dash-card">
              <h2>Atividade recente</h2>
              <Link href="/dashboard/activity" className="dash-back" style={{ margin: "-10px 0 0" }}>
                Ver toda a atividade →
              </Link>
              {data.activity.length === 0 ? (
                <Empty title="Sem atividade ainda" />
              ) : (
                <ul className="dash-list dash-activity">
                  {data.activity.map((a) => (
                    <li key={a.id}>
                      <span>
                        <b>{a.user?.name ?? "Alguém"}</b> · {a.summary}
                      </span>
                      <time>{dateTimeBR(a.createdAt)}</time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
