import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/modules/auth/actions";
import { canHandleApplications, canManageContent, canManageUsers, roleLabel } from "@/modules/auth/permissions";
import type { SessionUser } from "@/modules/auth/dal";
import { NavBadges } from "@/modules/overview/queries";
import { Sidebar, type NavGroup } from "./NavLinks";
import { Toast } from "./Toast";

// The menu follows the role: authors see only what they can use. Badges mark what is waiting for someone.
function groupsFor(user: SessionUser, badges: NavBadges): NavGroup[] {
  const groups: NavGroup[] = [
    { items: [{ href: "/dashboard", label: "Visão geral", icon: "home" }] },
    {
      title: "Conteúdo",
      items: [
        { href: "/dashboard/articles", label: "Artigos", icon: "doc", badge: canManageContent(user) ? badges.inReview : 0 },
        { href: "/dashboard/news", label: "Notícias", icon: "news" },
        ...(canManageContent(user)
          ? ([
              { href: "/dashboard/books", label: "Livros", icon: "book" },
              { href: "/dashboard/courses", label: "Cursos", icon: "course" },
              { href: "/dashboard/events", label: "Eventos", icon: "calendar" },
            ] as const)
          : []),
      ],
    },
  ];
  const people = [
    ...(canHandleApplications(user)
      ? ([
          { href: "/dashboard/applications", label: "Candidaturas", icon: "userPlus", badge: badges.applications },
          { href: "/dashboard/members", label: "Membros", icon: "users", badge: badges.endingSoon },
        ] as const)
      : []),
    ...(canManageContent(user)
      ? ([
          { href: "/dashboard/chapter-requests", label: "Pedidos de diretório", icon: "inbox", badge: badges.requests },
          { href: "/dashboard/chapters", label: "Diretórios", icon: "building" },
          { href: "/dashboard/certificates", label: "Certificados", icon: "award" },
        ] as const)
      : []),
  ];
  if (people.length) groups.push({ title: "Pessoas", items: [...people] });
  const admin = [
    ...(canManageContent(user) ? ([{ href: "/dashboard/activity", label: "Atividade", icon: "activity" }] as const) : []),
    ...(canManageUsers(user) ? ([{ href: "/dashboard/users", label: "Usuários", icon: "shield" }] as const) : []),
  ];
  if (admin.length) groups.push({ title: "Administração", items: [...admin] });
  return groups;
}

export function Shell({ user, badges, children }: { user: SessionUser; badges: NavBadges; children: ReactNode }) {
  const footer = (
    <div className="dash-user">
      <Link href="/dashboard/account" className="dash-user-link">
        <span className="dash-avatar" aria-hidden="true">
          {user.name.trim().charAt(0).toUpperCase()}
        </span>
        <span className="dash-user-text">
          <span className="dash-user-name">{user.name}</span>
          <span className="dash-user-role">{roleLabel[user.role]}</span>
        </span>
      </Link>
      <div className="dash-user-actions">
        <Link href="/" target="_blank">
          Ver o site ↗
        </Link>
        <form action={logout}>
          <button type="submit">Sair</button>
        </form>
      </div>
    </div>
  );
  return (
    <div className="dash dash-shell">
      <Sidebar groups={groupsFor(user, badges)} footer={footer} />
      <main className="dash-main" id="content">
        <Suspense>
          <Toast />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
