import { NextResponse } from "next/server";
import { interestLabel, memberTitleLabel, skillLabel } from "@/content/talent";
import { db } from "@/lib/db";
import { recordActivity } from "@/modules/activity/record";
import { applicationStatus } from "@/modules/applications/labels";
import { getSessionUser } from "@/modules/auth/dal";
import { canHandleApplications, canManageContent, chapterScope } from "@/modules/auth/permissions";
import { requestStatus } from "@/modules/chapter-requests/labels";

// CSV downloads of the people lists, for spreadsheets. Same scope as the screens: a coordinator only gets their own
// diretório. A cell that starts with = + - @ is prefixed with an apostrophe so a spreadsheet never runs it as a formula.
const cell = (value: unknown) => {
  let text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};
const row = (cells: unknown[]) => cells.map(cell).join(",");

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const user = await getSessionUser();
  if (!user || user.mustChangePassword) return new NextResponse("Entre no painel.", { status: 401 });
  const { kind } = await params;

  let header: string[];
  let lines: unknown[][];
  if (kind === "applications" && canHandleApplications(user)) {
    const items = await db.application.findMany({ where: chapterScope(user), orderBy: { createdAt: "desc" }, include: { chapter: { select: { name: true } } } });
    header = ["Nome", "E-mail", "Diretório", "Curso", "Período", "Competências", "Interesses", "Horas por semana", "Portfólio", "Situação", "Recebida em"];
    lines = items.map((a) => [a.name, a.email, a.chapter?.name ?? "", a.course, a.period, a.skills.map(skillLabel).join("; "), a.interests.map(interestLabel).join("; "), a.hoursPerWeek, a.portfolioUrl, applicationStatus(a.status).label, a.createdAt]);
  } else if (kind === "members" && canHandleApplications(user)) {
    const items = await db.membership.findMany({ where: chapterScope(user), orderBy: [{ endedOn: { sort: "asc", nulls: "first" } }, { name: "asc" }], include: { chapter: { select: { name: true } } } });
    header = ["Nome", "E-mail", "Diretório", "Função", "Início", "Fim previsto", "Saiu em", "Mentor"];
    lines = items.map((m) => [m.name, m.email, m.chapter.name, memberTitleLabel(m.title), m.startedOn, m.endsOn, m.endedOn, m.mentor ? "sim" : "não"]);
  } else if (kind === "chapter-requests" && canManageContent(user)) {
    const items = await db.chapterRequest.findMany({ orderBy: { createdAt: "desc" } });
    header = ["Nome", "E-mail", "Universidade", "Curso", "Situação", "Recebido em"];
    lines = items.map((r) => [r.name, r.email, r.university, r.course, requestStatus(r.status).label, r.createdAt]);
  } else {
    return new NextResponse("Não encontrado.", { status: 404 });
  }

  await recordActivity({ userId: user.id, action: "export", entity: kind, summary: `Exportou ${lines.length} linhas de ${kind} em CSV` });
  const body = `﻿${[row(header), ...lines.map(row)].join("\r\n")}\r\n`; // BOM so Excel reads the accents
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${kind}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
