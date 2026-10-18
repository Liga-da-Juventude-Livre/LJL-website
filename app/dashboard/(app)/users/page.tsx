import Link from "next/link";
import { Empty, LinkButton, PageHeader, Pill, SearchBox, dateTimeBR } from "@/components/dashboard/ui";
import { SubmitButton } from "@/components/dashboard/client";
import type { Role } from "@/generated/prisma/client";
import { requireRole } from "@/modules/auth/dal";
import { roleLabel } from "@/modules/auth/permissions";
import { setUserActive } from "@/modules/users/actions";
import { countUsersByRole, listUsers } from "@/modules/users/queries";

export const metadata = { title: "Usuários" };

const ROLES = Object.keys(roleLabel) as Role[];

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; status?: string }> }) {
  const me = await requireRole("ADMIN");
  const { q, role, status } = await searchParams;
  const roleFilter = ROLES.find((r) => r === role);
  const statusFilter = status === "active" || status === "inactive" ? status : undefined;
  const [users, counts] = await Promise.all([listUsers({ q: q?.trim() || undefined, role: roleFilter, status: statusFilter }), countUsersByRole()]);
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const href = (r?: string, s?: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (r) p.set("role", r);
    if (s) p.set("status", s);
    return `/dashboard/users${p.size ? `?${p}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Usuários" subtitle="Quem pode entrar no painel e o que cada pessoa pode fazer." actions={<LinkButton href="/dashboard/users/new">Nova conta</LinkButton>} />
      <nav className="dash-filters" aria-label="Filtrar por perfil">
        <Link href={href(undefined, statusFilter)} aria-current={!roleFilter}>
          Todos ({total})
        </Link>
        {ROLES.map((r) => (
          <Link key={r} href={href(r, statusFilter)} aria-current={roleFilter === r}>
            {roleLabel[r]} ({counts[r] ?? 0})
          </Link>
        ))}
      </nav>
      <div className="dash-toolbar">
        <SearchBox q={q} placeholder="Buscar por nome ou e-mail" keep={{ role: roleFilter, status: statusFilter }} />
        <nav className="dash-filters" aria-label="Filtrar por situação" style={{ margin: 0 }}>
          <Link href={href(roleFilter)} aria-current={!statusFilter}>
            Todas
          </Link>
          <Link href={href(roleFilter, "active")} aria-current={statusFilter === "active"}>
            Ativas
          </Link>
          <Link href={href(roleFilter, "inactive")} aria-current={statusFilter === "inactive"}>
            Desativadas
          </Link>
        </nav>
      </div>
      {users.length === 0 ? (
        <Empty title="Nenhuma conta encontrada">{q || roleFilter || statusFilter ? "Tente outra busca ou filtro." : "Crie a primeira conta."}</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Perfil</th>
                <th>Diretório</th>
                <th>Último acesso</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <p className="dash-title">
                      <Link href={`/dashboard/users/${u.id}`}>{u.name}</Link>
                      {u.id === me.id && <span className="dash-you">você</span>}
                    </p>
                    <p className="dash-sub">{u.email}</p>
                  </td>
                  <td>{roleLabel[u.role]}</td>
                  <td>{u.chapter?.name ?? "—"}</td>
                  <td>{u.lastLoginAt ? dateTimeBR(u.lastLoginAt) : "Nunca entrou"}</td>
                  <td>{u.active ? <Pill tone="green">Ativa</Pill> : <Pill>Desativada</Pill>}</td>
                  <td>
                    <div className="dash-actions-cell">
                      <Link className="dash-btn dash-btn-ghost dash-btn-sm" href={`/dashboard/users/${u.id}`}>
                        Editar
                      </Link>
                      {u.id !== me.id && (
                        <form action={setUserActive.bind(null, u.id, !u.active)} className="dash-inline-form">
                          <SubmitButton variant="ghost" pendingLabel="…">
                            {u.active ? "Desativar" : "Reativar"}
                          </SubmitButton>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
