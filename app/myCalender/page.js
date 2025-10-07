"use client";

import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DateTime } from "luxon";

import MemberNavbar from "../components/MemberNavBar";
import Button from "../components/ui/Button";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import CalendarBigEvent from "../components/myCalender/calenderBig";
import { deleteBookingByWorkshopId } from "@/lib/workshop_booking_crud";
import { supabase } from "@/lib/supabaseClient"; // <-- IMPORTANT
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MyCalendarPage = () => {
  // Code Below checks if user is logged in before running ANYTHING else
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/signIn");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    // Don’t render anything while redirecting
    return null;
  }

  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isTodayDisabled, setIsTodayDisabled] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // esc closes modal
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && setShowModal(false);
    if (showModal) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // fetch "my" event registrations (via API)
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);

        if (!user?.id) throw new Error("Not signed in (Clerk).");

        const res = await fetch(`/api/event_user`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const allRegistrations = await res.json();

        // filter for this user’s registrations
        const myEvents = allRegistrations.filter(
          (r) => String(r.user_id) === String(user.id)
        );

        // normalize event format for FullCalendar
        const formatted = myEvents
          .filter((r) => r.event_date && r.start_time)
          .map((r) => ({
            title: r.event_title ?? "Event",
            start: `${r.event_date}T${r.start_time}`,
          }));

        setEvents(formatted);
        setBookingData(myEvents);
      } catch (err) {
        console.error("Error loading events:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  const updateTitle = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    setCurrentTitle(api.view.title);

    if (api.view.type === "dayGridMonth") {
      const today = new Date();
      const { currentStart: start, currentEnd: end } = api.view;
      setIsTodayDisabled(today >= start && today < end);
    } else {
      setIsTodayDisabled(false);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  const handleEventClick = (eventInfo) => {
    const clicked = bookingData.find((item) => {
      const bookingStart = DateTime.fromISO(
        `${item.workshop?.date}T${item.workshop?.start_time}`
      );
      const eventStart = DateTime.fromISO(eventInfo.event.startStr);
      return (
        item.workshop?.title === eventInfo.event.title &&
        bookingStart.toISO() === eventStart.toISO()
      );
    });

    if (clicked?.workshop) {
      setSelectedEvent(clicked.workshop);
      setShowModal(true);
    } else {
      console.warn("No matching workshop found for event click");
    }
  };

  const handleCalendarNav = (action) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (action === "prev") api.prev();
    else if (action === "next") api.next();
    else if (action === "today") api.today();
    else if (action === "month") api.changeView("dayGridMonth");
    else if (action === "week") api.changeView("dayGridWeek");
    else if (action === "day") api.changeView("dayGridDay");
    updateTitle();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation */}
      <MemberNavbar />

      <h1 className="text-3xl font-bold text-center text-[#E55B3C] mt-6 mb-2">
        My Calendar
      </h1>

      {/* Toolbar */}
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button text="❮" onClick={() => handleCalendarNav("prev")} />
          <Button
            text="Today"
            onClick={() => handleCalendarNav("today")}
            disabled={isTodayDisabled}
          />
          <Button text="❯" onClick={() => handleCalendarNav("next")} />
        </div>

        <div className="text-black font-semibold text-lg">{currentTitle}</div>

        <div className="flex space-x-2">
          <Button text="Month" onClick={() => handleCalendarNav("month")} />
          <Button text="Week" onClick={() => handleCalendarNav("week")} />
          <Button text="Day" onClick={() => handleCalendarNav("day")} />
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-screen-lg mx-auto bg-white p-4 rounded shadow-md">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={false}
          height="auto"
          contentHeight="auto"
          eventClick={handleEventClick}
          eventContent={({ event }) => {
            try {
              const dateTime = DateTime.fromISO(event.startStr);
              const timeStr = dateTime.toFormat("h:mm a");
              return <CalenderSmallEvent time={timeStr} title={event.title} />;
            } catch {
              return <div>{event.title}</div>;
            }
          }}
        />
        {loading && <p className="text-gray-600 mt-2">Loading…</p>}
      </div>

      {showModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CalendarBigEvent
              workshop={selectedEvent}
              onClose={() => setShowModal(false)}
              onDelete={() => {
                if (!selectedEvent) return;
                deleteBookingByWorkshopId(selectedEvent.id)
                  .then(() => {
                    setEvents((prev) =>
                      prev.filter(
                        (e) =>
                          !(
                            e.title === selectedEvent.title &&
                            e.start ===
                              `${selectedEvent.date}T${selectedEvent.start_time}`
                          )
                      )
                    );
                    setShowModal(false);
                  })
                  .catch((err) =>
                    alert("Failed to delete booking: " + err.message)
                  );
              }}
            />
          </div>
        </div>
      )}

      {/* FullCalendar styling override */}
      <style jsx global>{`
        .fc {
          color: black;
        }
        .fc .fc-button,
        .fc .fc-toolbar-title,
        .fc .fc-daygrid-day-number,
        .fc .fc-col-header-cell-cushion {
          color: black;
        }
        .fc .fc-scrollgrid,
        .fc .fc-daygrid-day-frame {
          border-color: black !important;
        }
        .fc .fc-event {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .fc .fc-event:focus,
        .fc .fc-event:active {
          outline: none !important;
          box-shadow: none !important;
        }
        .fc-daygrid-day {
          height: 100px !important;
          vertical-align: top;
        }
        .fc-daygrid-day-frame {
          height: 100% !important;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .fc-event {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default MyCalendarPage;
