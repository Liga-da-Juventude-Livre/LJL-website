import { requireUser } from "@/modules/auth/dal";
import { PostList } from "@/modules/posts/ui/post-list";

export const metadata = { title: "Artigos" };

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = await requireUser();
  return <PostList user={user} type="ARTICLE" status={(await searchParams).status} />;
}
