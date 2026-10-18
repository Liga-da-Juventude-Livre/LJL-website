import { PageHeader } from "@/components/dashboard/ui";
import { db } from "@/lib/db";
import { requireRole } from "@/modules/auth/dal";
import { applicationScope } from "@/modules/auth/permissions";
import { listChapterOptions } from "@/modules/chapters/queries";
import { MemberForm } from "@/modules/members/ui/member-form";

export const metadata = { title: "Novo membro" };

export default async function NewMember({ searchParams }: { searchParams: Promise<{ application?: string }> }) {
  const user = await requireRole("ADMIN", "EDITOR", "COORDINATOR");
  const { application: applicationId } = await searchParams;
  const app = applicationId ? await db.application.findFirst({ where: { id: applicationId, ...applicationScope(user) } }) : null;
  const chapters = user.role === "COORDINATOR" ? [] : await listChapterOptions();
  // Today in Brasília ("sv-SE" formats as YYYY-MM-DD).
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
  return (
    <>
      <PageHeader title="Novo membro" subtitle={app ? "Os dados vêm da candidatura. Confira e defina a função e o mandato." : undefined} />
      <section className="dash-card">
        <MemberForm
          initial={{
            chapterId: app?.chapterId ?? "",
            name: app?.name ?? "",
            email: app?.email ?? "",
            title: "member",
            startedOn: today,
            endsOn: "",
            mentor: false,
            notes: "",
            applicationId: app?.id,
            userId: "",
          }}
          chapters={chapters}
          accounts={[]}
          cancelHref="/dashboard/members"
        />
      </section>
    </>
  );
}
