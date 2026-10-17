import type { PublishStatus, Role } from "@/generated/prisma/client";

// Who may do what. Pages and Server Actions both go through these, so the rules live in one place.
//   ADMIN  everything, including users
//   EDITOR all content (posts, books, events, diretórios) and publishing
//   AUTHOR writes posts; can save drafts and send them for review, but not publish

export type Actor = { id: string; role: Role };

export const isAdmin = (u: Actor) => u.role === "ADMIN";
export const canManageContent = (u: Actor) => u.role === "ADMIN" || u.role === "EDITOR";
export const canManageUsers = isAdmin;

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

export const roleLabel: Record<Role, string> = { ADMIN: "Administrador", EDITOR: "Editor", AUTHOR: "Autor" };
