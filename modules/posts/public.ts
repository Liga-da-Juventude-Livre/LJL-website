import "server-only";
import { db } from "@/lib/db";
import { brasiliaDay } from "@/lib/dates";
import { renderMarkdown } from "@/lib/markdown";

// What the public /articles pages show: only PUBLISHED articles, straight from the database, so the dashboard
// is what publishes them. The body goes through the safe Markdown renderer (raw HTML is shown as text).

export type PublicArticle = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  /** Brasília calendar day it was published, "YYYY-MM-DD". */
  date: string;
  front: string | null;
  minutes: number;
  /** Public address of the cover image, if the article has one. */
  coverUrl: string | null;
};

const readingMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));

const select = {
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  authorName: true,
  coverUrl: true,
  publishedAt: true,
  createdAt: true,
  front: { select: { name: true } },
} as const;

type Row = { slug: string; title: string; excerpt: string; body: string; authorName: string; coverUrl: string | null; publishedAt: Date | null; createdAt: Date; front: { name: string } | null };

const toMeta = (r: Row): PublicArticle => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  author: r.authorName,
  date: brasiliaDay(r.publishedAt ?? r.createdAt),
  front: r.front?.name ?? null,
  minutes: readingMinutes(r.body),
  coverUrl: r.coverUrl,
});

/** If the database cannot be reached the list is empty and the page shows its "em breve" state instead of failing. */
export async function listPublishedArticles(): Promise<PublicArticle[]> {
  try {
    const rows = await db.post.findMany({ where: { type: "ARTICLE", status: "PUBLISHED" }, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }], select });
    return rows.map(toMeta);
  } catch {
    return [];
  }
}

export async function getPublishedArticle(slug: string) {
  const row = await db.post.findFirst({ where: { type: "ARTICLE", slug, status: "PUBLISHED" }, select });
  return row ? { ...toMeta(row), html: renderMarkdown(row.body) } : null;
}
