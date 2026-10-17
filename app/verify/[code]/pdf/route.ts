import { siteUrl } from "@/lib/site-url";
import { normalizeCode } from "@/modules/certificates/codes";
import { buildCertificatePdf } from "@/modules/certificates/pdf";
import { getCertificateByCode } from "@/modules/certificates/queries";
import { legalLine } from "@/content/site";

export const dynamic = "force-dynamic";

// Public on purpose: the code is the credential, and the PDF holds exactly what /verify/<code> already shows.
// Revoked or unknown codes get a plain 404, so nothing is revealed about them.
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = normalizeCode(decodeURIComponent((await params).code));
  const cert = code ? await getCertificateByCode(code) : null;
  if (!cert || cert.revokedAt) return new Response("Certificado não encontrado.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  const pdf = await buildCertificatePdf({ ...cert, verifyUrl: `${await siteUrl()}/verify/${cert.code}`, legalLine });
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-${cert.code}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
