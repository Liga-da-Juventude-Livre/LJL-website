import type { PostType } from "@/generated/prisma/client";

// Articles and news share one table, one form and one list; only these labels and URLs differ.
export const POST_KINDS: Record<
  PostType,
  { plural: string; singular: string; newLabel: string; path: string; publicPath: string; needsFront: boolean }
> = {
  ARTICLE: { plural: "Artigos", singular: "artigo", newLabel: "Novo artigo", path: "/dashboard/articles", publicPath: "/articles", needsFront: true },
  NEWS: { plural: "Notícias", singular: "notícia", newLabel: "Nova notícia", path: "/dashboard/news", publicPath: "/news", needsFront: false },
};
