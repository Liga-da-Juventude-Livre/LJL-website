import "server-only";
import { del } from "@vercel/blob";
import { isUploadedImageUrl } from "./media";

// Uploaded images live in Vercel Blob (free on the Hobby plan, no card). The browser uploads straight to Blob with a
// short-lived token from app/dashboard/api/uploads/route.ts, so files never pass through the Next.js server.
// BLOB_READ_WRITE_TOKEN is created by Vercel when a Blob store is connected to the project.

export const isStorageConfigured = () => !!process.env.BLOB_READ_WRITE_TOKEN;

/** Best effort: a file left behind is harmless, a failed delete must never break saving a form. */
export async function deleteUploaded(url: string | null | undefined): Promise<void> {
  if (!url || !isStorageConfigured() || !isUploadedImageUrl(url)) return;
  try {
    await del(url);
  } catch {
    /* ignore */
  }
}
