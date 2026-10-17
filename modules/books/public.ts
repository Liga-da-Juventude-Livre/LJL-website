import "server-only";
import { books as fileBooks } from "@/content/library";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type PublicBook = {
  slug: string;
  title: string;
  author: string;
  year: number;
  front: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  note: string;
  featured: boolean;
  coverUrl: string | null;
  /** Free editions someone has checked (never an unchecked one). */
  downloads: { url: string; language: string; source: string; edition: string }[];
};

const LEVEL = { Iniciante: "BEGINNER", Intermediário: "INTERMEDIATE", Avançado: "ADVANCED" } as const;

// The library list the public site shows. It comes from the database, so the dashboard is what edits it.
// If the database cannot be reached, the seed list in content/library.ts keeps the page alive instead of failing it.
export async function getPublicBooks(): Promise<PublicBook[]> {
  try {
    const rows = await db.book.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: {
        front: { select: { name: true } },
        downloads: { where: { verifiedAt: { not: null } }, orderBy: { createdAt: "asc" }, select: { url: true, language: true, source: true, edition: true } },
      },
    });
    return rows.map((b) => ({
      slug: b.slug,
      title: b.title,
      author: b.author,
      year: b.year,
      front: b.front.name,
      level: b.level,
      note: b.note,
      featured: b.featured,
      coverUrl: b.coverUrl,
      downloads: b.downloads,
    }));
  } catch {
    return fileBooks.map((b) => ({
      slug: slugify(b.title),
      title: b.title,
      author: b.author,
      year: b.year,
      front: b.front,
      level: LEVEL[b.level],
      note: b.note,
      featured: !!b.start,
      coverUrl: null,
      downloads: b.download ? [b.download] : [],
    }));
  }
}
