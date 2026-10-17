"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { freeSlug } from "@/lib/slug";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { courseSchema, lessonSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR"] as const;
const editPath = (id: string) => `/dashboard/courses/${id}`;

export async function saveCourse(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { id, slug, ...data } = parsed.data;

  const taken = async (s: string) => !!(await db.course.findFirst({ where: { slug: s, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
  const existing = id ? await db.course.findUnique({ where: { id }, select: { slug: true } }) : null;
  if (id && !existing) notFound();
  const finalSlug = slug || existing?.slug || (await freeSlug(data.title, taken));
  if (slug && (await taken(slug))) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um curso com esse endereço."] });

  const fields = {
    ...data,
    slug: finalSlug,
    description: data.description ?? null,
    frontId: data.frontId ?? null,
    durationWeeks: data.durationWeeks ?? null,
    workloadHours: data.workloadHours ?? null,
  };
  let savedId = id;
  try {
    if (id) await db.course.update({ where: { id }, data: fields });
    else savedId = (await db.course.create({ data: { ...fields, createdById: user.id } })).id;
  } catch (error) {
    if (isUniqueViolation(error)) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um curso com esse endereço."] });
    throw error;
  }
  await recordActivity({ userId: user.id, action: id ? "course.update" : "course.create", entity: "Course", entityId: savedId, summary: `${id ? "Editou" : "Criou"} o curso ${data.title}` });
  // After creating, go to the edit page: that is where the lessons are added.
  redirect(id ? "/dashboard/courses" : editPath(savedId!));
}

export async function deleteCourse(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const course = await db.course.findUnique({ where: { id }, select: { title: true } });
  if (!course) notFound();
  await db.course.delete({ where: { id } }); // lessons go with it (cascade)
  await recordActivity({ userId: user.id, action: "course.delete", entity: "Course", entityId: id, summary: `Excluiu o curso ${course.title}` });
  redirect("/dashboard/courses");
}

/** Creates a lesson when `lessonId` is empty, otherwise updates it. */
export async function saveLesson(courseId: string, lessonId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = lessonSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const data = parsed.data;

  const course = await db.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } });
  if (!course) notFound();
  if (data.bookId && !(await db.book.findUnique({ where: { id: data.bookId }, select: { id: true } }))) {
    return failure(raw, "Corrija os campos destacados.", { bookId: ["Livro não encontrado."] });
  }

  const fields = {
    title: data.title,
    summary: data.summary ?? null,
    body: data.body ?? null,
    bookId: data.bookId ?? null,
    questions: data.questions,
    task: data.task ?? null,
    estimatedMinutes: data.estimatedMinutes ?? null,
  };
  if (lessonId) {
    const lesson = await db.lesson.findFirst({ where: { id: lessonId, courseId }, select: { id: true } });
    if (!lesson) notFound();
    await db.lesson.update({ where: { id: lessonId }, data: fields });
  } else {
    const last = await db.lesson.aggregate({ where: { courseId }, _max: { position: true } });
    await db.lesson.create({ data: { ...fields, courseId, position: (last._max.position ?? 0) + 1 } });
  }
  await recordActivity({ userId: user.id, action: lessonId ? "lesson.update" : "lesson.create", entity: "Course", entityId: courseId, summary: `${lessonId ? "Editou" : "Adicionou"} a aula “${data.title}” em ${course.title}` });
  revalidatePath(editPath(courseId));
  return { ok: lessonId ? "Aula salva." : "Aula adicionada." };
}

export async function moveLesson(lessonId: string, direction: "up" | "down"): Promise<void> {
  await requireRole(...roles);
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, select: { courseId: true } });
  if (!lesson) notFound();
  const lessons = await db.lesson.findMany({ where: { courseId: lesson.courseId }, orderBy: [{ position: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const from = lessons.findIndex((l) => l.id === lessonId);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= lessons.length) return;
  // Renumber the whole course 1..n with the two swapped, so ties and gaps can never confuse the order.
  const order = lessons.map((l) => l.id);
  [order[from], order[to]] = [order[to], order[from]];
  await db.$transaction(order.map((id, i) => db.lesson.update({ where: { id }, data: { position: i + 1 } })));
  revalidatePath(editPath(lesson.courseId));
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const user = await requireRole(...roles);
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, select: { courseId: true, title: true } });
  if (!lesson) notFound();
  await db.lesson.delete({ where: { id: lessonId } });
  await recordActivity({ userId: user.id, action: "lesson.delete", entity: "Course", entityId: lesson.courseId, summary: `Removeu a aula “${lesson.title}”` });
  revalidatePath(editPath(lesson.courseId));
}
