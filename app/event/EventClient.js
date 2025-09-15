// app/event/EventClient.jsx
"use client";

import { useMemo, useState } from "react";
import { List, Calendar } from "lucide-react";
import EventCard from "../components/event/eventCard";
import TabToggle from "../components/event/TabToggle";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import { DateTime } from "luxon";
import CalendarBigEvent from "../components/myCalender/calenderBig";

// initialEvents comes from the server (page.js)
export default function EventClient({ initialEvents = [] }) {
  const [events, setEvents] = useState(
    initialEvents.map((e) => ({
      ...e,
      id: typeof e.id === "string" ? Number(e.id) || e.id : e.id,
    }))
  );
  const [view, setView] = useState("list"); // 'list' | 'calendar'
  const [tab, setTab] = useState("upcoming"); // 'upcoming' | 'past'
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Combine SQL date + time into ISO string for FullCalendar
  const toStartISO = (w) => {
    if (!w?.date) return null;
    if (!w?.start_time) return w.date; // all-day
    const t = /^\d{2}:\d{2}(:\d{2})?$/.test(w.start_time)
      ? w.start_time.length === 5
        ? `${w.start_time}:00`
        : w.start_time
      : "00:00:00";
    return `${w.date}T${t}`;
  };

  const filteredEvents = useMemo(
    () =>
      events.filter((e) =>
        tab === "upcoming" ? e.status === "active" : e.status !== "active"
      ),
    [events, tab]
  );

  const handleEventClick = (arg) => {
    const clickedId = Number(arg?.event?.id);
    const w = events.find(
      (e) => e.id === (Number.isNaN(clickedId) ? arg.event.id : clickedId)
    );
    setSelectedEvent(w || null);
    setIsOpen(!!w);
  };

  const normalizeDate = (d) => {
    if (!d) return null;
    // handle 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss.sssZ'
    return d.split("T")[0];
  };

  const normalizeTime = (t) => {
    if (!t) return null;
    // accept 'HH:mm' or 'HH:mm:ss'
    if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
    return "00:00:00";
  };

  return (
    <>
      {/* Header / view toggle */}
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

      {/* LIST VIEW */}
      {view === "list" && (
        <section className="flex px-8 py-4 gap-6">
          <div className="w-1/4">
            <TabToggle current={tab} onChange={setTab} />
          </div>
          <div className="w-3/4">
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No events found.</div>
            )}
          </div>
        </section>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <section className="m-5 flex justify-center items-center">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events.map((e) => ({
              id: String(e.id),
              title: e.title,
              start: toStartISO(e),
            }))}
            eventClick={handleEventClick}
            eventContent={(info) => {
              const dt = info.event.start
                ? DateTime.fromJSDate(info.event.start)
                : null;
              const time = dt ? dt.toFormat("h:mm a") : "All day";
              return (
                <CalenderSmallEvent time={time} title={info.event.title} />
              );
            }}
          />

          {isOpen && selectedEvent && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
              <CalendarBigEvent
                workshop={selectedEvent}
                onClose={() => setIsOpen(false)}
              />
            </div>
          )}

          {/* FullCalendar styling */}
          <style jsx global>{`
            .fc {
              font-family: "Inter", sans-serif;
              color: black;
              margin: 0px 50px;
              height: 750px;
              width: 1300px;
            }
            .fc .fc-daygrid-day-frame {
              padding: 8px;
              min-height: 100px;
              min-width: 80px;
            }
            .fc-daygrid-day:hover {
              background-color: #f3f4f6;
            }
            .fc .fc-button {
              background-color: #e55b3c;
              color: white;
              border: none;
            }
            .fc-toolbar {
              color: #e55b3c;
            }
          `}</style>
        </section>
      )}
    </>
  );
}
