import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { deleteChapter } from "@/modules/chapters/actions";
import { getChapter } from "@/modules/chapters/queries";
import { ChapterForm } from "@/modules/chapters/ui/chapter-form";

export const metadata = { title: "Editar diretório" };

export default async function EditChapter({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const chapter = await getChapter((await params).id);
  if (!chapter) notFound();
  return (
    <>
      <PageHeader title={chapter.name} subtitle={chapter.university} />
      <section className="dash-card">
        <ChapterForm
          deleteAction={deleteChapter.bind(null, chapter.id)}
          initial={{
            id: chapter.id,
            name: chapter.name,
            slug: chapter.slug,
            university: chapter.university,
            city: chapter.city,
            state: chapter.state ?? "",
            description: chapter.description ?? "",
            contactEmail: chapter.contactEmail ?? "",
            foundedAt: chapter.foundedAt ? chapter.foundedAt.toISOString().slice(0, 10) : "",
            active: chapter.active,
          }}
        />
      </section>
    </>
  );
}
