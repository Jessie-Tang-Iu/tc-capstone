"use client";

import { useEffect, useState } from "react";
import { List, Calendar } from "lucide-react";
import Navbar from "../components/NavBar";
import EventCard from "../components/event/eventCard";
import TabToggle from "../components/event/TabToggle";
import { getAllEvents, updateEventStatus } from "@/lib/workshop_crud";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import { DateTime } from "luxon";
import CalendarBigEvent from "../components/myCalender/calenderBig";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("list");
  const [tab, setTab] = useState("upcoming");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchAndUpdateEvents() {
      const data = await getAllEvents();
      const now = new Date();

      // Auto-update events with past dates
      const updates = await Promise.all(
        data.map(async (event) => {
          const eventDate = new Date(event.date);
          if (event.status === "active" && eventDate < now) {
            await updateEventStatus(event.id, "completed");
            return { ...event, status: "completed" };
          }
          return event;
        })
      );

      setEvents(updates);
    }

    fetchAndUpdateEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    tab === "upcoming" ? event.status === "active" : event.status !== "active"
  );

  const handleEventClick = (e) => {
    console.log("Selected Event: ",e.event);
    console.log("Selected Event id: ",Number(e.event.id));

    const workshop = events.find((event) => event.id === Number(e.event.id));
    console.log("Workshop: ", workshop);
    setSelectedEvent(workshop);
    setIsOpen(true);
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <Navbar />
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

      {view === "calendar" && (
        <section className="m-5 flex justify-center items-center">
          <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                // convert data for Full Calendar use
                events={events.map(event => ({
                    ...event,
                    start: `${event.date}T${event.start_time}`
                }))}
                eventClick={handleEventClick}
                eventContent={( eventInfo ) => {
                    try {
                        const startTime = DateTime.fromJSDate(eventInfo.event.start).toFormat("h:mm a");
                    return (
                        <CalenderSmallEvent
                            time={startTime}
                            title={eventInfo.event.title}
                        />
                    );
                    } catch (error) {
                        console.log(error);
                        return <div>{eventInfo.event.title}</div>;
                    }
                }}
            />

            {isOpen &&
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
              <CalendarBigEvent 
                workshop={selectedEvent}
                onClose={() => setIsOpen(false)} />
            </div>
              
            }

            {/* Calendar Style */}
            <style jsx global>
                {`.fc {
                font-family: 'Inter', sans-serif;
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
                background-color: #f3f4f6; /* Tailwind's gray-100 */
                }

                .fc .fc-button {
                background-color: #E55B3C;
                color: white;
                border: none;
                }

                .fc-toolbar {
                color: #E55B3C;
                }

                `}
            </style>
        </section>
      )}
    </main>
  );
}
