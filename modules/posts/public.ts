import "server-only";
import { db } from "@/lib/db";
import { brasiliaDay } from "@/lib/dates";
import { renderMarkdown } from "@/lib/markdown";
import { PAINEL_URL, painelGet } from "@/lib/painel";

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
  /** Author's role and photo (articles written in the Liga's panel). */
  authorRole?: string | null;
  authorPhoto?: string | null;
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
  const [own, painel] = await Promise.all([
    (async () => {
      try {
        const rows = await db.post.findMany({ where: { type: "ARTICLE", status: "PUBLISHED" }, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }], select });
        return rows.map(toMeta);
      } catch {
        return [] as PublicArticle[];
      }
    })(),
    listPainelArticles(),
  ]);
  const taken = new Set(own.map((a) => a.slug));
  return [...own, ...painel.filter((a) => !taken.has(a.slug))].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPublishedArticle(slug: string) {
  let row: Row | null = null;
  try {
    row = await db.post.findFirst({ where: { type: "ARTICLE", slug, status: "PUBLISHED" }, select });
  } catch {
    // database unreachable: the panel's articles still show
  }
  return row ? { ...toMeta(row), html: renderMarkdown(row.body) } : getPainelArticle(slug);
}

// ---- Articles written and reviewed in the Liga's panel (see lib/painel.ts) ----

const TEMAS: Record<string, string> = {
  ideias: "Ideias e ideologia",
  politicas: "Políticas públicas",
  momento: "Assuntos do momento",
  economia: "Economia",
  instituicoes: "Instituições",
  direito: "Direito",
  educacao: "Educação",
  seguranca: "Segurança",
  universidade: "Universidade",
};

type PainelAutor = { id?: string; nome?: string; cargo?: string; fotoV?: number };
type PainelResumo = { slug: string; titulo: string; linhaFina?: string; tema?: string; publicadoEm: string; minutos?: number; autor?: PainelAutor };

const cargoLiga = (c?: string) => (!c ? "Liga da Juventude Livre" : /liga/i.test(c) ? c : `${c} da Liga da Juventude Livre`);
const fotoDe = (a?: PainelAutor) => (a?.id && a.fotoV && /^[a-z0-9]+$/i.test(a.id) ? `${PAINEL_URL}/api/foto/m-${a.id}?v=${a.fotoV}` : null);

const fromPainel = (a: PainelResumo, autor?: PainelAutor): PublicArticle => ({
  slug: a.slug,
  title: a.titulo,
  excerpt: a.linhaFina ?? "",
  author: (autor ?? a.autor)?.nome || "Liga da Juventude Livre",
  authorRole: cargoLiga((autor ?? a.autor)?.cargo),
  authorPhoto: fotoDe(autor ?? a.autor),
  date: brasiliaDay(new Date(a.publicadoEm)),
  front: (a.tema && TEMAS[a.tema]) || "Opinião",
  minutes: a.minutos ?? 3,
  coverUrl: null,
});

async function listPainelArticles(): Promise<PublicArticle[]> {
  const data = await painelGet<{ artigos: PainelResumo[] }>("artigos");
  return (data?.artigos ?? []).filter((a) => a?.slug && a?.titulo && a?.publicadoEm).map((a) => fromPainel(a));
}

async function getPainelArticle(slug: string) {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return null;
  const data = await painelGet<{ artigo: PainelResumo & { corpo: string }; autor?: PainelAutor }>(`artigos/${encodeURIComponent(slug)}`);
  if (!data?.artigo?.corpo) return null;
  return { ...fromPainel(data.artigo, data.autor), html: renderMarkdown(data.artigo.corpo) };
}
