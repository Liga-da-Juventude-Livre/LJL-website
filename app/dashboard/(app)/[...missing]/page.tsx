import { notFound } from "next/navigation";

// Any unknown address under /dashboard ends up here, so it gets the dashboard's own 404 instead of the public one.
export default function Missing() {
  notFound();
}
