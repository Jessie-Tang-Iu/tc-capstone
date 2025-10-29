// app/event/[id]/page.js
import { notFound } from "next/navigation";
import Navbar from "@/app/components/MemberNavBar";
import SafeImage from "@/app/components/fallback";
import EventDetailClient from "@/app/components/event/EventDetailClient";
import BackToOrigin from "@/app/components/event/BackToOrigin.js";
import { headers } from "next/headers";

export default async function EventDetailPage(props) {
  const { id } = await props.params;
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const base = `${proto}://${host}`;

  // Fetch via your API
  const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const event = await res.json();

  return (
    <main className="bg-gray-100 min-h-screen text-black flex flex-col">
      <Navbar />
      <BackToOrigin />

      <div className="max-w-5xl mx-auto px-4 pt-8 pb-40 flex-grow">
        <div className="rounded-md mt-4 mb-6 flex justify-center">
          {/* <SafeImage
            srcBase={`https://mvxperspoentcqazciyx.supabase.co/storage/v1/object/public/eventbanner/${event.id}`}
            fallbackSrc="/fallback.png"
            alt={event.title}
            width={600}
            height={400}
            className="rounded-md border"
          /> */}
        </div>

        {/* Event Title */}
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

        {/* Description Section (scoped styling) */}
        <div className="event-description">
          <style>{`
            .event-description h1 {
              font-size: 1.75rem;
              font-weight: bold;
              margin-bottom: 1rem;
            }
            .event-description ul {
              list-style-type: disc;
              margin-left: 1.5rem;
            }
            .event-description ol {
              list-style-type: decimal;
              margin-left: 1.5rem;
            }
            .event-description a {
              color: #2563eb;
              text-decoration: underline;
            }
            .event-description a:hover {
              color: #1d4ed8;
            }
          `}</style>

          <div
            style={{ color: "black", fontSize: "1rem", lineHeight: "1.6" }}
            dangerouslySetInnerHTML={{ __html: event.description || "" }}
          ></div>
        </div>
      </div>

      <EventDetailClient event={event} />
    </main>
  );
}
