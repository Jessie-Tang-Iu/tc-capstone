// app/event/EventClient.jsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { List, Calendar } from "lucide-react";
import EventCard from "../components/event/eventCard";
import TabToggle from "../components/event/TabToggle";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import CalendarBigEvent from "../components/myCalender/calenderBig";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";
import { useSearchParams } from "next/navigation";

export default function EventClient({ initialEvents = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events] = useState(
    initialEvents.map((e) => ({
      ...e,
      id: typeof e.id === "string" ? Number(e.id) || e.id : e.id,
    }))
  );
  const [view, setView] = useState("list");
  const [tab, setTab] = useState("upcoming");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // --- normalizers ---
  const normalizeDate = (d) => {
    if (!d) return null;
    if (typeof d === "string") return d.includes("T") ? d.split("T")[0] : d;
    if (d instanceof Date && !isNaN(d.getTime()))
      return d.toISOString().slice(0, 10);
    if (typeof d === "object" && typeof d.date === "string")
      return d.date.includes("T") ? d.date.split("T")[0] : d.date;
    return null;
  };

  const normalizeTime = (t) => {
    if (!t) return null;
    if (typeof t === "string") {
      if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
      if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
      return null; // unrecognized -> all-day
    }
    if (t instanceof Date && !isNaN(t.getTime()))
      return t.toTimeString().slice(0, 8);
    if (typeof t === "object" && Number.isInteger(t.hours)) {
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(t.hours)}:${pad(t.minutes || 0)}:${pad(t.seconds || 0)}`;
    }
    return null;
  };

  // when building filteredEvents for the list:
  const isFutureEvent = (e) => {
    const date = normalizeDate(e.date);
    if (!date) return false;

    const time = normalizeTime(e.start_time);
    const dateTimeStr = time ? `${date}T${time}` : `${date}T23:59:59`;
    const eventDateTime = new Date(dateTimeStr);
    return eventDateTime >= new Date();
  };

  const filteredEvents = useMemo(
    () =>
      events
        .filter((e) => {
          const future = isFutureEvent(e);
          return tab === "upcoming" ? future : !future;
        })
        .map((e) => ({
          ...e,
          date: normalizeDate(e.date) ?? e.date,
          start_time: normalizeTime(e.start_time) ?? null,
        })),
    [events, tab]
  );
  // Build FC-ready events once
  const calendarEvents = useMemo(
    () =>
      events
        .map((row) => {
          const dateOnly = normalizeDate(row.date);
          if (!dateOnly) return null;

          const time = normalizeTime(row.start_time);
          const allDay = !time;

          return {
            id: String(row.id),
            title: row.title || "Untitled",
            start: allDay ? dateOnly : `${dateOnly}T${time}`,
            allDay,
          };
        })
        .filter(Boolean),
    [events]
  );

  const handleEventClick = (arg) => {
    const clickedId = Number(arg?.event?.id);
    const w = events.find(
      (e) => e.id === (Number.isNaN(clickedId) ? arg.event.id : clickedId)
    );
    setSelectedEvent(w || null);
    setIsOpen(!!w);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const qpView = searchParams.get("view");
    const qpTab = searchParams.get("tab");
    if (qpView === "calendar" || qpView === "list") setView(qpView);
    if (qpTab) setTab(qpTab);
  }, [searchParams]);

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
            events={calendarEvents}
            eventClick={handleEventClick}
            eventContent={(info) => {
              // Use FullCalendar's own time string; avoids Luxon entirely
              const timeText = info.timeText || "All day";
              return (
                <CalenderSmallEvent time={timeText} title={info.event.title} />
              );
            }}
          />

          {isOpen && selectedEvent && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="rounded-lg p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Wrapper is relative so the button can be absolutely placed "inside" the card */}
                <CalendarBigEvent
                  workshop={selectedEvent}
                  onClose={() => setIsOpen(false)}
                  onView={() => {
                    const id = selectedEvent?.id;
                    if (id === undefined || id === null) return;
                    setIsOpen(false);
                    router.push(
                      `/event/${encodeURIComponent(
                        String(id)
                      )}?from=calendar&tab=${encodeURIComponent(tab)}`
                    );
                  }}
                />
              </div>
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
