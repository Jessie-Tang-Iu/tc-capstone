import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import Navbar from "@/app/components/NavBar";
import { getEventById } from "@/lib/event_crud";
import SafeImage from "@/app/components/fallback";

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

  const imageUrl = `https://mvxperspoentcqazciyx.supabase.co/storage/v1/object/public/eventbanner/${event.id}.jpg`;
  return (
    <main className="bg-gray-100 min-h-screen text-black">
      <Navbar />

      <Link
        href="/event"
        className="mt-6 ml-8 text-sm text-gray-600 hover:underline inline-block mb-4"
      >
        &lt; Back to All Events
      </Link>

      <div className="max-w-4xl mx-auto px-4 py-8 ">
        <div className="rounded-md mt-4 mb-6 flex justify-center">
          <SafeImage
            src={`https://mvxperspoentcqazciyx.supabase.co/storage/v1/object/public/eventbanner/${id}.jpg`}
            fallbackSrc="https://mvxperspoentcqazciyx.supabase.co/storage/v1/object/public/eventbanner/fallback.png"
            alt={event.title}
            width={600}
            height={400}
            className="rounded-md border"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <p className="mb-6 leading-relaxed">{event.description}</p>
      </div>

      <div className="text-gray-700 mb-2">
        <strong>Date:</strong> {event.date}
      </div>

      <div className="text-gray-700 mb-6">
        <strong>Location:</strong> {event.location}
      </div>

      <div className="flex justify-end">
        <Button text="Register Me" />
      </div>
    </main>
  );
}
