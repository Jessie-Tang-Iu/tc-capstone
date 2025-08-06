"use client";

import { useState } from "react";
import { List, Calendar } from "lucide-react";
import Navbar from "../components/NavBar";
import EventCard from "../components/event/eventCard";
import TabToggle from "../components/event/TabToggle";
import dummyEvents from "../data/events.json"; // ← you forgot to import this

export default function EventPage() {
  const [view, setView] = useState("list");
  const [tab, setTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const now = new Date();
  const filteredEvents = dummyEvents.filter((event) => {
    const eventDate = new Date(event.date);
    if (tab === "upcoming") return eventDate >= now;
    if (tab === "past") return eventDate < now;
  });

  return (
    <main className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Page Title & Toggle */}
      <section className="bg-white py-6 px-4 border-b">
        <h1 className="text-center text-xl font-semibold text-orange-500">
          Join our events and Connect with Tech Connect Alberta
        </h1>

        <div className="flex justify-left mt-4">
          <div className="flex border rounded-md shadow-sm overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition text-black ${
                view === "list" ? "bg-gray-200 font-bold" : "hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4 text-gray-600" />
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition text-black ${
                view === "calendar"
                  ? "bg-gray-200 font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4 text-gray-600" />
              Calendar
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {view === "list" && (
        <section className="flex px-8 py-4 gap-6">
          {/* Left column: tab toggle */}
          <div className="w-1/4">
            <TabToggle current={tab} onChange={setTab} />
          </div>

          {/* Right column: event list */}
          <div className="w-3/4">
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="cursor-pointer hover:opacity-90"
                  >
                    <EventCard {...event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No events found.</div>
            )}
          </div>
        </section>
      )}

      {view === "calendar" && (
        <section className="bg-gray-200 mx-8 h-[400px] rounded-md flex items-center justify-center text-gray-500 text-sm">
          Calendar view goes here
        </section>
      )}
    </main>
  );
}
