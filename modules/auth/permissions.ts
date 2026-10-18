import type { PublishStatus, Role } from "@/generated/prisma/client";

// Who may do what. Pages and Server Actions both go through these, so the rules live in one place.
//   ADMIN  everything, including users
//   EDITOR all content (posts, books, events, diretórios) and publishing
//   COORDINATOR writes posts like an author, and handles the applications of their own diretório
//   AUTHOR writes posts; can save drafts and send them for review, but not publish

export type Actor = { id: string; role: Role; chapterId?: string | null };

export const isAdmin = (u: Actor) => u.role === "ADMIN";
export const canManageContent = (u: Actor) => u.role === "ADMIN" || u.role === "EDITOR";
export const canManageUsers = isAdmin;
export const canHandleApplications = (u: Actor) => canManageContent(u) || u.role === "COORDINATOR";

/** Prisma filter for the applications this person may see: central staff see all, a coordinator only their own
 *  diretório's (and nothing while no diretório is set on their account). */
export function chapterScope(u: Actor): { chapterId?: string; id?: { in: string[] } } {
  if (canManageContent(u)) return {};
  return u.role === "COORDINATOR" && u.chapterId ? { chapterId: u.chapterId } : { id: { in: [] } };
}

type PostLike = { createdById: string | null; status: PublishStatus };

export function canEditPost(u: Actor, post: PostLike) {
  if (canManageContent(u)) return true;
  return post.createdById === u.id && (post.status === "DRAFT" || post.status === "IN_REVIEW");
}

export function canDeletePost(u: Actor, post: PostLike) {
  return canManageContent(u) || (post.createdById === u.id && post.status === "DRAFT");
}

export function allowedStatuses(u: Actor): PublishStatus[] {
  return canManageContent(u) ? ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] : ["DRAFT", "IN_REVIEW"];
}

export const roleLabel: Record<Role, string> = { ADMIN: "Administrador", EDITOR: "Editor", COORDINATOR: "Coordenação de diretório", AUTHOR: "Autor" };

/** Applications and memberships are both scoped to a diretório. */
export const applicationScope = chapterScope;
