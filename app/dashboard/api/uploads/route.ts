import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MEDIA_SCOPES } from "@/lib/media";
import { isStorageConfigured } from "@/lib/storage";
import { getSessionUser } from "@/modules/auth/dal";
import { canManageContent } from "@/modules/auth/permissions";

// Step 1 of an image upload: hands the logged-in browser a short-lived token to upload one image straight to Blob.
// The token only allows the given folder, the three image types and 5 MB. Nothing is saved in the database until the
// form that owns the image is submitted. Authors may upload article images; only editors and administrators, book covers.
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.mustChangePassword) return NextResponse.json({ error: "Entre no painel para enviar imagens." }, { status: 401 });
  if (!isStorageConfigured()) return NextResponse.json({ error: "O armazenamento de imagens ainda não foi configurado." }, { status: 503 });

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const scope = pathname.split("/")[0];
        if (!(MEDIA_SCOPES as readonly string[]).includes(scope) || pathname.split("/").length !== 2) throw new Error("Destino inválido.");
        if (scope === "books" && !canManageContent(user)) throw new Error("Seu perfil não pode enviar capas de livros.");
        return {
          allowedContentTypes: Object.keys(IMAGE_TYPES),
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível enviar." }, { status: 400 });
  }
}
