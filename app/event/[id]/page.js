import dummyEvents from "@/app/data/events.json";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import Navbar from "@/app/components/NavBar";

export default function EventDetailPage({ params }) {
  const { id } = params;
  const event = dummyEvents.find((e) => e.id === id);

  if (!event) return notFound();

  return (
    <main className="bg-gray-100 min-h-screen text-black">
      <Navbar />

      <Link
        href="/event"
        className="text-sm text-gray-600 hover:underline inline-block mb-4"
      >
        &lt; Back to All Events
      </Link>

      <div className="rounded-md border mt-4 mb-6 flex justify-center">
        <Image
          src="/event_banner.jpg"
          alt={event.title}
          width={800}
          height={400}
          className="rounded-md border"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <p className="mb-6 leading-relaxed">{event.description}</p>

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
