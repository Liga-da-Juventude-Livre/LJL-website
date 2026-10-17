import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { ChapterForm, emptyChapter } from "@/modules/chapters/ui/chapter-form";

export const metadata = { title: "Novo diretório" };

export default async function NewChapter() {
  await requireRole("ADMIN", "EDITOR");
  return (
    <>
      <PageHeader title="Novo diretório" />
      <section className="dash-card">
        <ChapterForm initial={emptyChapter} />
      </section>
    </>
  );
}
