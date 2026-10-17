import Link from "next/link";
import { LinkButton, PageHeader, Pill, dateTimeBR } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { roleLabel } from "@/modules/auth/permissions";
import { listUsers } from "@/modules/users/queries";

export const metadata = { title: "Usuários" };

export default async function UsersPage() {
  await requireRole("ADMIN");
  const users = await listUsers();
  return (
    <>
      <PageHeader title="Usuários" subtitle="Quem pode entrar no painel." actions={<LinkButton href="/dashboard/users/new">Nova conta</LinkButton>} />
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Perfil</th>
              <th>Diretório</th>
              <th>Último acesso</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <p className="dash-title">
                    <Link href={`/dashboard/users/${u.id}`}>{u.name}</Link>
                  </p>
                  <p className="dash-sub">{u.email}</p>
                </td>
                <td>{roleLabel[u.role]}</td>
                <td>{u.chapter?.name ?? "—"}</td>
                <td>{dateTimeBR(u.lastLoginAt)}</td>
                <td>{u.active ? <Pill tone="green">Ativa</Pill> : <Pill>Desativada</Pill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
