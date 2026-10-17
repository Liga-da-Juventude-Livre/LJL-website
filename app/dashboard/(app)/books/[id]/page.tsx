import { isStorageConfigured } from "@/lib/storage";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { deleteBook } from "@/modules/books/actions";
import { getBook } from "@/modules/books/queries";
import { BookForm } from "@/modules/books/ui/book-form";
import { DownloadsEditor } from "@/modules/books/ui/downloads-editor";
import { listFronts } from "@/modules/fronts/queries";

export const metadata = { title: "Editar livro" };

export default async function EditBook({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const book = await getBook((await params).id);
  if (!book) notFound();
  return (
    <>
      <PageHeader title={book.title} subtitle={`${book.author}, ${book.year}`} />
      <div className="dash-stack">
        <section className="dash-card">
          <BookForm
            fronts={await listFronts()}
            storageReady={isStorageConfigured()}
            deleteAction={deleteBook.bind(null, book.id)}
            initial={{
              id: book.id,
              title: book.title,
              slug: book.slug,
              author: book.author,
              year: String(book.year),
              level: book.level,
              note: book.note,
              frontId: book.frontId,
              featured: book.featured,
              published: book.published,
              sortOrder: String(book.sortOrder),
              coverUrl: book.coverUrl ?? "",
            }}
          />
        </section>
        <section className="dash-card">
          <h2>Edições gratuitas</h2>
          <p className="dash-field-hint">
            Só entram links em que o próprio editor ou detentor dos direitos oferece o livro de graça. Nada de arquivos copiados de outros sites.
          </p>
          <DownloadsEditor bookId={book.id} downloads={book.downloads} />
        </section>
      </div>
    </>
  );
}
