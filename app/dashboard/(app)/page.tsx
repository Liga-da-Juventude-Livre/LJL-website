import Link from "next/link";
import { Empty, PageHeader, dateTimeBR } from "@/components/dashboard/ui";
import { requireUser } from "@/modules/auth/dal";
import { POST_KINDS } from "@/modules/posts/config";
import { getOverview } from "@/modules/overview/queries";

export const metadata = { title: "Visão geral" };

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser();
  const [data, { denied }] = await Promise.all([getOverview(user), searchParams]);

  const tiles = [
    { n: data.publishedArticles, l: "Artigos publicados", href: "/dashboard/articles?status=PUBLISHED" },
    { n: data.publishedNews, l: "Notícias publicadas", href: "/dashboard/news?status=PUBLISHED" },
    { n: data.inReview, l: "Em revisão", href: "/dashboard/articles?status=IN_REVIEW" },
    { n: data.drafts, l: "Rascunhos", href: "/dashboard/articles?status=DRAFT" },
    ...(data.editor
      ? [
          { n: data.books, l: "Livros na biblioteca", href: "/dashboard/books" },
          { n: data.courses, l: "Cursos publicados", href: "/dashboard/courses" },
          { n: data.certificates, l: "Certificados válidos", href: "/dashboard/certificates" },
          { n: data.upcomingEvents, l: "Próximos eventos", href: "/dashboard/events" },
          { n: data.chapters, l: "Diretórios ativos", href: "/dashboard/chapters" },
          { n: data.newRequests, l: "Pedidos de diretório novos", href: "/dashboard/chapter-requests?status=NEW" },
        ]
      : []),
    ...(data.canApplications ? [{ n: data.newApplications, l: "Candidaturas novas", href: "/dashboard/applications?status=NEW" }, { n: data.endingSoon, l: "Mandatos terminando", href: "/dashboard/members" }] : []),
    ...(user.role === "ADMIN" ? [{ n: data.users, l: "Pessoas com acesso", href: "/dashboard/users" }] : []),
  ];

  return (
    <>
      <PageHeader title={`Olá, ${user.name.split(" ")[0]}`} subtitle={data.editor ? "O que está acontecendo na Liga." : "Seus textos."} />
      {denied && (
        <p className="dash-alert dash-alert-warn" role="status">
          Você não tem acesso a essa página.
        </p>
      )}
      <div className="dash-stack">
        <div className="dash-stats">
          {tiles.map((t) => (
            <Link key={t.l} href={t.href} className="dash-stat">
              <span className="dash-stat-n">{t.n}</span>
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
              {data.activity.length === 0 ? (
                <Empty title="Sem atividade ainda" />
              ) : (
                <ul className="dash-list">
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
