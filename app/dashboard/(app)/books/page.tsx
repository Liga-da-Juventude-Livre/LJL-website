import Link from "next/link";
import { bookCovers } from "@/assets/books/covers";
import { BookCover } from "@/components/BookCover";
import { Empty, LinkButton, PageHeader, Pill } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { levelLabel } from "@/modules/books/labels";
import { listBooks } from "@/modules/books/queries";

export const metadata = { title: "Livros" };

export default async function BooksPage() {
  await requireRole("ADMIN", "EDITOR");
  const books = await listBooks();
  return (
    <>
      <PageHeader title="Livros" subtitle="A biblioteca da Liga: recomendações e edições gratuitas." actions={<LinkButton href="/dashboard/books/new">Novo livro</LinkButton>} />
      {books.length === 0 ? (
        <Empty title="Nenhum livro cadastrado">Cadastre o primeiro.</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Frente</th>
                <th>Nível</th>
                <th>Gratuitos</th>
                <th>Exibição</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="dash-book-cell">
                      {(b.coverUrl || bookCovers[b.slug]) && <BookCover book={{ ...b, front: b.front.name }} size="sm" />}
                      <div>
                        <p className="dash-title">
                          <Link href={`/dashboard/books/${b.id}`}>{b.title}</Link>
                        </p>
                        <p className="dash-sub">
                          {b.author}, {b.year}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{b.front.name}</td>
                  <td>{levelLabel(b.level)}</td>
                  <td>{b._count.downloads || "—"}</td>
                  <td>
                    {b.published ? <Pill tone="green">Publicado</Pill> : <Pill>Oculto</Pill>} {b.featured && <Pill tone="yellow">Começar</Pill>}
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
