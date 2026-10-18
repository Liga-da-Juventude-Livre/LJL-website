import { redirect } from "next/navigation";

/** Redirects to `path` with a short success message that the dashboard shows once as a toast (see components/dashboard/Toast.tsx). */
export function redirectWithNotice(path: string, message: string): never {
  const [base, hash] = path.split("#");
  redirect(`${base}${base.includes("?") ? "&" : "?"}ok=${encodeURIComponent(message)}${hash ? `#${hash}` : ""}`);
}
