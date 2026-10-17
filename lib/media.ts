// Shared by the server and the browser: what an uploaded image may be, and what a stored image address looks like.
// Images live in Vercel Blob; forms may only send back an address of exactly that shape (never an arbitrary URL).

export const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MEDIA_SCOPES = ["posts", "books"] as const;
export type MediaScope = (typeof MEDIA_SCOPES)[number];

/** https://<store>.public.blob.vercel-storage.com/<scope>/<file>.<jpg|png|webp> (Blob may add a random suffix to the name). */
export function isUploadedImageUrl(url: string, scope?: MediaScope): boolean {
  return new RegExp(`^https://[a-z0-9]+\\.public\\.blob\\.vercel-storage\\.com/(${scope ?? MEDIA_SCOPES.join("|")})/[A-Za-z0-9._-]+\\.(jpg|png|webp)$`).test(url);
}
