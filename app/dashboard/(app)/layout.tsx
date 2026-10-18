import { redirect } from "next/navigation";
import { Shell } from "@/components/dashboard/Shell";
import { getSessionUser } from "@/modules/auth/dal";
import { getNavBadges } from "@/modules/overview/queries";

// Every page under here is behind login. Each page still calls requireUser()/requireRole() itself
// (that is also what sends someone with a temporary password to /dashboard/account first).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard/login");
  const badges = await getNavBadges(user);
  return (
    <Shell user={user} badges={badges}>
      {children}
    </Shell>
  );
}
