import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/slug";
import { uploadedImage, optionalText, text } from "@/lib/forms";

export const postSchema = z
  .object({
    id: optionalText(40),
    type: z.enum(["ARTICLE", "NEWS"]),
    title: text(3, 140),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .refine((v) => v === "" || SLUG_PATTERN.test(v), "Use só letras minúsculas, números e hífens.")
      .optional(),
    excerpt: text(10, 300),
    body: text(20, 60000),
    authorName: text(2, 100),
    coverUrl: uploadedImage("posts"),
    frontId: optionalText(40),
    chapterId: optionalText(40),
    status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]),
  })
  .superRefine((d, ctx) => {
    if (d.type === "ARTICLE" && !d.frontId) ctx.addIssue({ code: "custom", path: ["frontId"], message: "Escolha a frente do artigo." });
  });
