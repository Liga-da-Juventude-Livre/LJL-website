import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listChapterOptions } from "@/modules/chapters/queries";
import { getUser } from "@/modules/users/queries";
import { UserForm } from "@/modules/users/ui/user-form";

export const metadata = { title: "Editar conta" };

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const user = await getUser((await params).id);
  if (!user) notFound();
  return (
    <>
      <PageHeader title={user.name} subtitle={user.email} />
      <section className="dash-card">
        <UserForm
          chapters={await listChapterOptions()}
          initial={{ id: user.id, name: user.name, email: user.email, role: user.role, chapterId: user.chapterId ?? "", active: user.active }}
        />
      </section>
    </>
  );
}
