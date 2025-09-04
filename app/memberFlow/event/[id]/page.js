import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/NavBar";
import { getEventById } from "@/lib/workshop_crud";
import SafeImage from "@/app/components/fallback";
import EventDetailClient from "@/app/components/event/EventDetailClient";

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const numericId = Number(id); // safer

  let event;
  try {
    event = await getEventById(id);
  } catch (err) {
    console.error("Event not found:", err.message);
    return notFound();
  }

  function convertNewlinesAndLinks(text) {
    const escaped = text
      .replace(/&/g, "&amp;") // escape basic HTML
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const withLinks = escaped.replace(
      /((https?:\/\/)[^\s<]+)/g,
      (match) =>
        `<a href="${match}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${match}</a>`
    );

    const withBreaks = withLinks.replace(/\n/g, "<br />");

    return withBreaks;
  }

  return (
    <main className="bg-gray-100 min-h-screen text-black flex flex-col">
      <Navbar />
      <Link
        href="/event"
        className="mt-6 ml-8 text-sm text-gray-600 hover:underline inline-block mb-4"
      >
        &lt; Back to All Events
      </Link>
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-40 flex-grow">
        <div className="rounded-md mt-4 mb-6 flex justify-center">
          <SafeImage
            srcBase={`https://mvxperspoentcqazciyx.supabase.co/storage/v1/object/public/eventbanner/${id}`}
            fallbackSrc="https://via.placeholder.com/600x400?text=No+Image"
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
            __html: convertNewlinesAndLinks(event.description),
          }}
        />
      </div>
      <EventDetailClient event={event} />
    </main>
  );
}
