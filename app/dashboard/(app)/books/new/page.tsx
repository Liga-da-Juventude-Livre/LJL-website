import { isStorageConfigured } from "@/lib/storage";
import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { BookForm, emptyBook } from "@/modules/books/ui/book-form";
import { listFronts } from "@/modules/fronts/queries";

export const metadata = { title: "Novo livro" };

export default async function NewBook() {
  await requireRole("ADMIN", "EDITOR");
  return (
    <>
      <PageHeader title="Novo livro" subtitle="Depois de cadastrar, você pode adicionar edições gratuitas." />
      <section className="dash-card">
        <BookForm initial={emptyBook} storageReady={isStorageConfigured()} fronts={await listFronts()} />
      </section>
    </>
  );
}
