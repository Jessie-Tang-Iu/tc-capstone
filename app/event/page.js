// app/event/page.js
import MemberNavbar from "../components/MemberNavBar";
import EventClient from "./EventClient"; // client component below
import {
  getAllEvents,
  updateEventStatus,
} from "../../backend/database/workshop_crud"; // relative import to your backend file

export default async function EventPage() {
  // 1) Load workshops straight from Postgres (server-side)
  let events = await getAllEvents();

  // 2) (Optional) Auto-mark past "active" events as "completed"
  //    This runs only on the server during page render.
  const now = new Date();
  const needsUpdate = events.filter(
    (e) => e.status === "active" && new Date(e.date) < now
  );
  if (needsUpdate.length) {
    await Promise.all(
      needsUpdate.map((e) => updateEventStatus(e.id, "completed"))
    );
    // re-read to reflect updates in UI
    events = await getAllEvents();
  }

  // 3) Render UI via client component
  return (
    <main className="bg-gray-100 min-h-screen">
      <MemberNavbar />
      <EventClient initialEvents={events} />
    </main>
  );
}
