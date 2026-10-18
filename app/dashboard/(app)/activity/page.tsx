import Link from "next/link";
import { Empty, PageHeader, Pager, SearchBox, dateTimeBR } from "@/components/dashboard/ui";
import { db } from "@/lib/db";
import { requireRole } from "@/modules/auth/dal";

export const metadata = { title: "Atividade" };

const PAGE_SIZE = 40;

// Who did what in the dashboard, newest first. Lines name the diretório or the item, never a person's data.
const ENTITIES = [
  { value: "Post", label: "Textos" },
  { value: "Book", label: "Livros" },
  { value: "Course", label: "Cursos" },
  { value: "Event", label: "Eventos" },
  { value: "Certificate", label: "Certificados" },
  { value: "Application", label: "Candidaturas" },
  { value: "Membership", label: "Membros" },
  { value: "User", label: "Usuários" },
];

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ q?: string; entity?: string; page?: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const { q, entity, page: rawPage } = await searchParams;
  const entityFilter = ENTITIES.find((e) => e.value === entity)?.value;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);
  const where = {
    ...(entityFilter ? { entity: entityFilter } : {}),
    ...(q?.trim() ? { OR: [{ summary: { contains: q.trim(), mode: "insensitive" as const } }, { user: { name: { contains: q.trim(), mode: "insensitive" as const } } }] } : {}),
  };
  const [total, items] = await Promise.all([
    db.activityLog.count({ where }),
    db.activityLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: { id: true, summary: true, createdAt: true, user: { select: { name: true } } } }),
  ]);
  const href = (p: number, e = entityFilter) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (e) params.set("entity", e);
    if (p > 1) params.set("page", String(p));
    return `/dashboard/activity${params.size ? `?${params}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Atividade" subtitle="O histórico de tudo o que a equipe fez no painel." />
      <nav className="dash-filters" aria-label="Filtrar por assunto">
        <Link href={href(1, undefined)} aria-current={!entityFilter}>
          Tudo
        </Link>
        {ENTITIES.map((e) => (
          <Link key={e.value} href={href(1, e.value)} aria-current={entityFilter === e.value}>
            {e.label}
          </Link>
        ))}
      </nav>
      <SearchBox q={q} placeholder="Buscar por pessoa ou descrição" keep={{ entity: entityFilter }} />
      {items.length === 0 ? (
        <Empty title="Nada por aqui">{q || entityFilter ? "Tente outra busca ou filtro." : "As ações da equipe aparecem aqui."}</Empty>
      ) : (
        <section className="dash-card">
          <ul className="dash-list dash-activity">
            {items.map((a) => (
              <li key={a.id}>
                <span>
                  <b>{a.user?.name ?? "Alguém"}</b> · {a.summary}
                </span>
                <time>{dateTimeBR(a.createdAt)}</time>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Pager page={page} pageCount={Math.ceil(total / PAGE_SIZE)} total={total} hrefFor={(p) => href(p)} />
    </>
  );
}
