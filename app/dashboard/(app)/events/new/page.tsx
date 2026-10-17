import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listChapterOptions } from "@/modules/chapters/queries";
import { EventForm, emptyEvent } from "@/modules/events/ui/event-form";

export const metadata = { title: "Novo evento" };

export default async function NewEvent() {
  await requireRole("ADMIN", "EDITOR");
  return (
    <>
      <PageHeader title="Novo evento" />
      <section className="dash-card">
        <EventForm initial={emptyEvent} chapters={await listChapterOptions()} />
      </section>
    </>
  );
}
