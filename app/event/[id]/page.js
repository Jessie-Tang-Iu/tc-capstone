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

  const convertNewlinesAndLinks = (text = "") => {
    const safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const withLinks = safe.replace(
      /((https?:\/\/)[^\s<]+)/g,
      (m) =>
        `<a href="${m}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${m}</a>`
    );
    return withLinks.replace(/\n/g, "<br />");
  };

  return (
    <main className="bg-gray-100 min-h-screen text-black flex flex-col">
      <Navbar />
      <BackToOrigin />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-40 flex-grow">
        <div className="rounded-md mt-4 mb-6 flex justify-center">
          <SafeImage
            srcBase={`https://mvxperspoentcqazciyx.supabase.co/storage/v1/object/public/eventbanner/${event.id}`}
            fallbackSrc="/fallback.png"
            alt={event.title}
            width={600}
            height={400}
            className="rounded-md border"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

        <div
          className="mb-6 leading-relaxed prose prose-sm prose-a:text-blue-600 prose-a:underline"
          dangerouslySetInnerHTML={{
            __html: convertNewlinesAndLinks(event.description || ""),
          }}
        />
      </div>

      <EventDetailClient event={event} />
    </main>
  );
}
