import { isStorageConfigured } from "@/lib/storage";
import { PageHeader } from "@/components/dashboard/ui";
import { requireUser } from "@/modules/auth/dal";
import { allowedStatuses } from "@/modules/auth/permissions";
import { listChapterOptions } from "@/modules/chapters/queries";
import { listFronts } from "@/modules/fronts/queries";
import { POST_KINDS } from "@/modules/posts/config";
import { PostForm } from "@/modules/posts/ui/post-form";

export const metadata = { title: POST_KINDS.NEWS.newLabel };

export default async function Page() {
  const user = await requireUser();
  const [fronts, chapters] = await Promise.all([listFronts(), listChapterOptions()]);
  return (
    <>
      <PageHeader title={POST_KINDS.NEWS.newLabel} />
      <section className="dash-card">
        <PostForm
          fronts={fronts}
          chapters={chapters}
          statuses={allowedStatuses(user)}
          storageReady={isStorageConfigured()}
          initial={{ type: "NEWS", title: "", slug: "", excerpt: "", body: "", authorName: user.name, coverUrl: "", frontId: "", chapterId: user.chapterId ?? "", status: "DRAFT" }}
        />
      </section>
    </>
  );
}
