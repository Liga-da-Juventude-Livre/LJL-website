import { notFound } from "next/navigation";
import { PageHeader, StatusBadge, toLocalInput } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listChapterOptions } from "@/modules/chapters/queries";
import { deleteEvent } from "@/modules/events/actions";
import { getEvent } from "@/modules/events/queries";
import { EventForm } from "@/modules/events/ui/event-form";

export const metadata = { title: "Editar evento" };

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const event = await getEvent((await params).id);
  if (!event) notFound();
  return (
    <>
      <PageHeader title={event.title} actions={<StatusBadge status={event.status} />} />
      <section className="dash-card">
        <EventForm
          chapters={await listChapterOptions()}
          deleteAction={deleteEvent.bind(null, event.id)}
          initial={{
            id: event.id,
            title: event.title,
            slug: event.slug,
            description: event.description,
            startsAt: toLocalInput(event.startsAt),
            endsAt: toLocalInput(event.endsAt),
            location: event.location ?? "",
            onlineUrl: event.onlineUrl ?? "",
            registrationUrl: event.registrationUrl ?? "",
            chapterId: event.chapterId ?? "",
            status: event.status,
          }}
        />
      </section>
    </>
  );
}
