import "server-only";
import { db } from "@/lib/db";

export type CertificateFilter = { status?: "valid" | "revoked"; q?: string };

export function listCertificates({ status, q }: CertificateFilter = {}) {
  const term = q?.trim();
  return db.certificate.findMany({
    where: {
      ...(status === "valid" ? { revokedAt: null } : status === "revoked" ? { revokedAt: { not: null } } : {}),
      ...(term
        ? { OR: [{ recipientName: { contains: term, mode: "insensitive" } }, { title: { contains: term, mode: "insensitive" } }, { code: { contains: term.toUpperCase() } }] }
        : {}),
    },
    orderBy: { issuedAt: "desc" },
    take: 300,
  });
}

export const countCertificates = async () => {
  const [valid, revoked] = await Promise.all([db.certificate.count({ where: { revokedAt: null } }), db.certificate.count({ where: { revokedAt: { not: null } } })]);
  return { valid, revoked, all: valid + revoked };
};

export const getCertificate = (id: string) => db.certificate.findUnique({ where: { id } });

/** What the public may see by code. The e-mail is deliberately not selected. */
export const getCertificateByCode = (code: string) =>
  db.certificate.findUnique({
    where: { code },
    select: { code: true, kind: true, recipientName: true, title: true, hours: true, completedOn: true, issuedAt: true, revokedAt: true },
  });

export const listCourseOptions = () =>
  db.course.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }], select: { id: true, title: true, kind: true, workloadHours: true, issuesCertificate: true } });

export const listEventOptions = () =>
  db.event.findMany({ orderBy: { startsAt: "desc" }, take: 60, select: { id: true, title: true } });
