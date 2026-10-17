import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/slug";
import { checkbox, intField, uploadedImage, optionalText, text } from "@/lib/forms";

export const bookSchema = z.object({
  id: optionalText(40),
  title: text(2, 160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "Use só letras minúsculas, números e hífens.")
    .optional(),
  author: text(2, 160),
  year: intField(1, 2100, "ano"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  note: text(10, 400),
  frontId: text(1, 40),
  featured: checkbox,
  published: checkbox,
  sortOrder: intField(0, 999, "número"),
  coverUrl: uploadedImage("books"),
});

export const downloadSchema = z.object({
  url: z.url({ protocol: /^https$/, error: "Use um endereço completo, começando com https://" }),
  language: text(2, 60),
  source: text(2, 120),
  edition: text(2, 160),
  verified: checkbox,
});
