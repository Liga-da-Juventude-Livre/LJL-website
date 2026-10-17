// No "server-only" here on purpose: it is also run from plain Node when checking the layout. It reads font files
// from disk and uses node:fs, so it cannot end up in a client bundle anyway.
import fs from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import { BRACKET_PATH, J_PATH, L_PATH } from "@/components/Logo";

export type CertificatePdfData = {
  code: string;
  kind: "COMPLETION" | "PARTICIPATION";
  recipientName: string;
  title: string;
  hours: number;
  /** A calendar date held as UTC midnight. */
  completedOn: Date;
  issuedAt: Date;
  verifyUrl: string;
  /** Optional line under the disclaimer, e.g. the organisation's CNPJ. Left out until the Liga provides one. */
  legalLine?: string;
};

// A4 landscape, in PDF points. The frame echoes the logo: a green L in the bottom-left corner, a yellow bracket top-right.
const W = 841.89;
const H = 595.28;
const M = 56;
const GREEN = rgb(0, 0.388, 0.196);
const YELLOW = rgb(0.988, 0.706, 0.192);
const INK = rgb(0.098, 0.086, 0.09);
const MUTED = rgb(0.36, 0.373, 0.353);
const RULE = rgb(0.86, 0.85, 0.82);

const FONT_FILES = {
  sans700: "archivo-latin-700-normal.woff",
  sans800: "archivo-latin-800-normal.woff",
  serif: "source-serif-4-latin-400-normal.woff",
  serifItalic: "source-serif-4-latin-400-italic.woff",
} as const;

let fontBytes: Promise<Record<keyof typeof FONT_FILES, Buffer>> | undefined;
const readFonts = () =>
  (fontBytes ??= (async () => {
    const dir = path.join(process.cwd(), "assets", "fonts");
    const entries = await Promise.all(Object.entries(FONT_FILES).map(async ([k, f]) => [k, await fs.readFile(path.join(dir, f))] as const));
    return Object.fromEntries(entries) as Record<keyof typeof FONT_FILES, Buffer>;
  })());

// Letters that have no accent to strip but do have a plain look-alike.
const LOOKALIKE: Record<string, string> = { Ł: "L", ł: "l", Đ: "D", đ: "d", Ø: "O", ø: "o", Ħ: "H", ħ: "h", ı: "i", ẞ: "SS" };

/** Makes text drawable with the (Latin subset) font: unsupported letters become their plain look-alike when there is one,
 *  emoji are dropped, and anything else becomes "?". So an unusual name never crashes or prints empty boxes. */
const clean = (font: PDFFont, text: string) => {
  const set = new Set(font.getCharacterSet());
  const has = (ch: string) => set.has(ch.codePointAt(0)!);
  return Array.from(text.normalize("NFC").replace(/\s+/g, " "))
    .map((ch) => {
      if (has(ch)) return ch;
      if (/\p{Extended_Pictographic}|\uFE0F|\u200D/u.test(ch)) return "";
      const plain = LOOKALIKE[ch] ?? ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return plain && Array.from(plain).every(has) ? plain : "?";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
};

function wrap(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function spaced(page: PDFPage, text: string, x: number, y: number, size: number, font: PDFFont, tracking: number, color = GREEN) {
  let cx = x;
  for (const ch of Array.from(text)) {
    page.drawText(ch, { x: cx, y, size, font, color });
    cx += font.widthOfTextAtSize(ch, size) + tracking;
  }
}

const longDate = (d: Date, timeZone: string) => new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone }).format(d);

export async function buildCertificatePdf(c: CertificatePdfData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const bytes = await readFonts();
  const [sans700, sans800, serif, serifItalic] = await Promise.all([
    pdf.embedFont(bytes.sans700, { subset: true }),
    pdf.embedFont(bytes.sans800, { subset: true }),
    pdf.embedFont(bytes.serif, { subset: true }),
    pdf.embedFont(bytes.serifItalic, { subset: true }),
  ]);
  const page = pdf.addPage([W, H]);
  const y = (fromTop: number) => H - fromTop; // work top-down like a layout, draw bottom-up like PDF

  // frame: green L (bottom-left) and yellow bracket (top-right)
  page.drawRectangle({ x: 0, y: 0, width: 14, height: 170, color: GREEN });
  page.drawRectangle({ x: 0, y: 0, width: 250, height: 14, color: GREEN });
  page.drawRectangle({ x: W - 250, y: H - 14, width: 250, height: 14, color: YELLOW });
  page.drawRectangle({ x: W - 14, y: H - 170, width: 14, height: 170, color: YELLOW });

  // brand
  const logoScale = 0.15;
  const logoTop = 44;
  page.drawSvgPath(L_PATH, { x: M, y: y(logoTop), scale: logoScale, color: GREEN });
  page.drawSvgPath(BRACKET_PATH, { x: M, y: y(logoTop), scale: logoScale, color: YELLOW });
  page.drawSvgPath(J_PATH, { x: M, y: y(logoTop), scale: logoScale, color: INK });
  page.drawText("Liga da", { x: M + 58, y: y(logoTop + 22), size: 13, font: sans700, color: INK });
  page.drawText("Juventude Livre", { x: M + 58 + sans700.widthOfTextAtSize("Liga da ", 13), y: y(logoTop + 22), size: 13, font: sans800, color: INK });

  // heading
  spaced(page, "CERTIFICADO", M, y(142), 11, sans700, 3.2);
  page.drawText("Certificamos que", { x: M, y: y(176), size: 17, font: serifItalic, color: MUTED });

  // name: one line if it fits at a decent size, else two lines
  const maxW = W - 2 * M;
  const name = clean(sans800, c.recipientName);
  let cursor = 0;
  const sizes = [46, 40, 34, 30];
  const fit = sizes.find((s) => sans800.widthOfTextAtSize(name, s) <= maxW);
  if (fit) {
    page.drawText(name, { x: M, y: y(224), size: fit, font: sans800, color: INK });
    cursor = 224;
  } else {
    const lines = wrap(sans800, name, 30, maxW).slice(0, 2);
    lines.forEach((line, i) => page.drawText(line, { x: M, y: y(218 + i * 36), size: 30, font: sans800, color: INK }));
    cursor = 218 + (lines.length - 1) * 36;
  }
  page.drawRectangle({ x: M, y: y(cursor + 16), width: 84, height: 5, color: YELLOW });

  // what it certifies
  cursor += 52;
  page.drawText(c.kind === "COMPLETION" ? "concluiu" : "participou de", { x: M, y: y(cursor), size: 17, font: serifItalic, color: MUTED });
  cursor += 34;
  const title = clean(sans800, c.title);
  const titleLines = wrap(sans800, title, 24, maxW).slice(0, 2);
  titleLines.forEach((line, i) => page.drawText(line, { x: M, y: y(cursor + i * 30), size: 24, font: sans800, color: GREEN }));
  cursor += (titleLines.length - 1) * 30 + 38;
  const hours = `${c.hours} ${c.hours === 1 ? "hora" : "horas"}`;
  page.drawText(`com carga horária de ${hours}, concluída em ${longDate(c.completedOn, "UTC")}.`, { x: M, y: y(cursor), size: 17, font: serif, color: INK });

  // footer: code, where to check it, QR
  const qrSize = 92;
  const footerTop = 458;
  page.drawRectangle({ x: M, y: y(footerTop), width: W - 2 * M, height: 1, color: RULE });
  const textW = W - 2 * M - qrSize - 28;
  let fy = footerTop + 24;
  spaced(page, "CÓDIGO DE VERIFICAÇÃO", M, y(fy), 8, sans700, 1.8);
  fy += 19;
  page.drawText(c.code, { x: M, y: y(fy), size: 16, font: sans800, color: INK });
  fy += 17;
  const urlLine = clean(serif, `Confira em ${c.verifyUrl}`);
  for (const line of wrap(serif, urlLine, 9.5, textW).slice(0, 2)) {
    page.drawText(line, { x: M, y: y(fy), size: 9.5, font: serif, color: MUTED });
    fy += 12;
  }
  const disclaimer =
    `Emitido pela Liga da Juventude Livre em ${longDate(c.issuedAt, "America/Sao_Paulo")}. Este documento comprova a participação na atividade indicada. ` +
    "O aproveitamento como atividade complementar depende das regras de cada instituição de ensino." +
    (c.legalLine ? ` ${c.legalLine}` : "");
  fy += 3;
  for (const line of wrap(serifItalic, clean(serifItalic, disclaimer), 8.5, textW).slice(0, 4)) {
    page.drawText(line, { x: M, y: y(fy), size: 8.5, font: serifItalic, color: MUTED });
    fy += 10.5;
  }

  // QR code as vector squares, so it stays sharp at any print size
  const qr = QRCode.create(c.verifyUrl, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const cell = qrSize / n;
  const qrX = W - M - qrSize;
  const qrTop = footerTop + 20;
  for (let r = 0; r < n; r++) {
    for (let col = 0; col < n; col++) {
      if (qr.modules.get(r, col)) page.drawRectangle({ x: qrX + col * cell, y: y(qrTop + (r + 1) * cell), width: cell + 0.25, height: cell + 0.25, color: INK });
    }
  }
  spaced(page, "APONTE A CÂMERA", qrX, y(qrTop + qrSize + 13), 6.5, sans700, 1.4, MUTED);

  pdf.setTitle(`Certificado ${c.code}`);
  pdf.setAuthor("Liga da Juventude Livre");
  pdf.setSubject(`${c.kind === "COMPLETION" ? "Conclusão" : "Participação"}: ${c.title}`);
  pdf.setProducer("Liga da Juventude Livre");
  pdf.setCreator("Liga da Juventude Livre");
  pdf.setCreationDate(c.issuedAt);
  return pdf.save();
}
