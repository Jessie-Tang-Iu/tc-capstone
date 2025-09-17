// app/event/page.js
import MemberNavbar from "../components/MemberNavBar";
import EventClient from "./EventClient";
import { headers } from "next/headers";

export default async function EventPage() {
  // Build absolute URL for this request (works in dev, prod, Vercel, proxies)
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const baseUrl = `${proto}://${host}`;

  // Fetch events via API (server-side)
  let events = [];
  try {
    const res = await fetch(`${baseUrl}/api/events`, { cache: "no-store" });
    if (res.ok) {
      events = await res.json();
    } else {
      console.error("GET /api/events failed:", await res.text());
    }
  } catch (err) {
    console.error("GET /api/events error:", err);
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <MemberNavbar />
      <EventClient initialEvents={events} />
    </main>
  );
}
