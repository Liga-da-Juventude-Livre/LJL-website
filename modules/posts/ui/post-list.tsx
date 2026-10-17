import Link from "next/link";
import { ConfirmButton } from "@/components/dashboard/client";
import { Empty, LinkButton, PageHeader, StatusBadge, dateBR, statusLabel } from "@/components/dashboard/ui";
import type { PostType, PublishStatus } from "@/generated/prisma/client";
import type { SessionUser } from "@/modules/auth/dal";
import { canDeletePost, canManageContent } from "@/modules/auth/permissions";
import { deletePost, setPostStatus } from "@/modules/posts/actions";
import { POST_KINDS } from "@/modules/posts/config";
import { countPostsByStatus, listPosts } from "@/modules/posts/queries";

const FILTERS: PublishStatus[] = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"];

/** The list screen for articles and for news: filter by status, publish or delete from the row. */
export async function PostList({ user, type, status }: { user: SessionUser; type: PostType; status?: string }) {
  const kind = POST_KINDS[type];
  const filter = FILTERS.find((s) => s === status);
  const [posts, counts] = await Promise.all([listPosts(user, type, filter), countPostsByStatus(user, type)]);
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const editor = canManageContent(user);

  return (
    <>
      <PageHeader
        title={kind.plural}
        subtitle={editor ? undefined : "Você vê os textos que criou."}
        actions={<LinkButton href={`${kind.path}/new`}>{kind.newLabel}</LinkButton>}
      />
      <nav className="dash-filters" aria-label="Filtrar por situação">
        <Link href={kind.path} aria-current={!filter}>
          Todos ({total})
        </Link>
        {FILTERS.map((s) => (
          <Link key={s} href={`${kind.path}?status=${s}`} aria-current={filter === s}>
            {statusLabel(s)} ({counts[s] ?? 0})
          </Link>
        ))}
      </nav>
      {posts.length === 0 ? (
        <Empty title={`Nenhum ${kind.singular} aqui`}>{filter ? "Tente outro filtro." : `Comece criando ${kind.singular === "artigo" ? "um artigo" : "uma notícia"}.`}</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Situação</th>
                <th>Atualizado</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="dash-title">
                      <Link href={`${kind.path}/${p.id}`}>{p.title}</Link>
                    </p>
                    <p className="dash-sub">
                      {p.authorName}
                      {p.front ? ` · ${p.front.name}` : ""}
                    </p>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>{dateBR(p.updatedAt)}</td>
                  <td>
                    <div className="dash-actions-cell">
                      {editor && p.status !== "PUBLISHED" && (
                        <form action={setPostStatus.bind(null, p.id, "PUBLISHED")} className="dash-inline-form">
                          <ConfirmButton variant="ghost" message="Publicar agora?">
                            Publicar
                          </ConfirmButton>
                        </form>
                      )}
                      {canDeletePost(user, p) && (
                        <form action={deletePost.bind(null, p.id)} className="dash-inline-form">
                          <ConfirmButton message={`Excluir ${kind.singular}? Isso não pode ser desfeito.`}>Excluir</ConfirmButton>
                        </form>
                      )}
                    </div>
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
