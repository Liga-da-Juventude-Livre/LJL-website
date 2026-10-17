export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** First free slug: `base`, then `base-2`, `base-3`… `taken` answers whether a candidate is already used. */
export async function freeSlug(base: string, taken: (slug: string) => Promise<boolean>): Promise<string> {
  const root = slugify(base) || "item";
  let slug = root;
  for (let i = 2; await taken(slug); i++) slug = `${root}-${i}`;
  return slug;
}
