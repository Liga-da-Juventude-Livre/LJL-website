import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listChapterOptions } from "@/modules/chapters/queries";
import { UserForm, emptyUser } from "@/modules/users/ui/user-form";

export const metadata = { title: "Nova conta" };

export default async function NewUser() {
  await requireRole("ADMIN");
  return (
    <>
      <PageHeader title="Nova conta" />
      <section className="dash-card">
        <UserForm initial={emptyUser} chapters={await listChapterOptions()} />
      </section>
    </>
  );
}
