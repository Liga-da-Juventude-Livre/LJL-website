import { isStorageConfigured } from "@/lib/storage";
import { notFound } from "next/navigation";
import { PageHeader, StatusBadge } from "@/components/dashboard/ui";
import { requireUser } from "@/modules/auth/dal";
import { allowedStatuses, canDeletePost, canEditPost } from "@/modules/auth/permissions";
import { listChapterOptions } from "@/modules/chapters/queries";
import { listFronts } from "@/modules/fronts/queries";
import { deletePost } from "@/modules/posts/actions";
import { getPost } from "@/modules/posts/queries";
import { PostForm } from "@/modules/posts/ui/post-form";

export const metadata = { title: "Editar" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const post = await getPost((await params).id);
  if (!post || post.type !== "ARTICLE") notFound();
  if (!canEditPost(user, post)) {
    return (
      <>
        <PageHeader title={post.title} subtitle="Você não pode editar este texto." actions={<StatusBadge status={post.status} />} />
      </>
    );
  }
  const [fronts, chapters] = await Promise.all([listFronts(), listChapterOptions()]);
  const statuses = allowedStatuses(user);
  return (
    <>
      <PageHeader title={post.title} actions={<StatusBadge status={post.status} />} />
      <section className="dash-card">
        <PostForm
          fronts={fronts}
          chapters={chapters}
          statuses={statuses.includes(post.status) ? statuses : [post.status, ...statuses]}
          storageReady={isStorageConfigured()}
          deleteAction={canDeletePost(user, post) ? deletePost.bind(null, post.id) : undefined}
          initial={{
            id: post.id,
            type: post.type,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            body: post.body,
            authorName: post.authorName,
            coverUrl: post.coverUrl ?? "",
            frontId: post.frontId ?? "",
            chapterId: post.chapterId ?? "",
            status: post.status,
          }}
        />
      </section>
    </>
  );
}
