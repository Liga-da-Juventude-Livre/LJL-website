import { notFound } from "next/navigation";
import { PageHeader, Pill, dateTimeBR } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { roleLabel } from "@/modules/auth/permissions";
import { listChapterOptions } from "@/modules/chapters/queries";
import { getUser } from "@/modules/users/queries";
import { DeleteUser } from "@/modules/users/ui/delete-user";
import { UserForm } from "@/modules/users/ui/user-form";

export const metadata = { title: "Editar conta" };

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireRole("ADMIN");
  const user = await getUser((await params).id);
  if (!user) notFound();
  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/users", label: "Usuários" }}
        title={user.name}
        subtitle={`${user.email} · ${roleLabel[user.role]} · ${user.lastLoginAt ? `último acesso ${dateTimeBR(user.lastLoginAt)}` : "nunca entrou"}`}
        actions={user.active ? <Pill tone="green">Ativa</Pill> : <Pill>Desativada</Pill>}
      />
      <div className="dash-stack">
        <section className="dash-card">
          <UserForm
            chapters={await listChapterOptions()}
            initial={{ id: user.id, name: user.name, email: user.email, role: user.role, chapterId: user.chapterId ?? "", active: user.active }}
          />
        </section>
        {user.id !== me.id && (
          <section className="dash-card dash-card-danger">
            <h2>Excluir conta</h2>
            <p>Remove o acesso de vez. Para só impedir o acesso por um tempo, use “Conta ativa” acima. O que a pessoa escreveu e os certificados que emitiu continuam no painel.</p>
            <div className="dash-form-actions">
              <DeleteUser id={user.id} name={user.name} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
