import type { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: { default: "Painel da Liga", template: "%s · Painel da Liga" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
