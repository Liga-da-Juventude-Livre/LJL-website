import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

// Public pages plus every published article and course. Rebuilt at most once an hour; if the database cannot be
// reached the fixed pages are still listed. Needs SITE_URL in production so the addresses are absolute.
export const revalidate = 3600;

const PAGES = ["", "/library", "/courses", "/chapters", "/articles", "/verify"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const fixed: MetadataRoute.Sitemap = PAGES.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
  try {
    const [articles, courses] = await Promise.all([
      db.post.findMany({ where: { type: "ARTICLE", status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      db.course.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...fixed,
      ...articles.map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: a.updatedAt, priority: 0.6 })),
      ...courses.map((c) => ({ url: `${base}/courses/${c.slug}`, lastModified: c.updatedAt, priority: 0.6 })),
    ];
  } catch {
    return fixed;
  }
}
