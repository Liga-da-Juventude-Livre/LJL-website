import { Icon } from "./icons";

/** Downloads the list as a CSV (see app/dashboard/export). A plain link, not a Next route: the browser saves the file. */
export function ExportLink({ kind }: { kind: "applications" | "members" | "chapter-requests" }) {
  return (
    <a className="dash-btn dash-btn-ghost" href={`/dashboard/export/${kind}`} download>
      <Icon name="download" size={16} />
      Exportar CSV
    </a>
  );
}
