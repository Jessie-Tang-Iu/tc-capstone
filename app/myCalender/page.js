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
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MyCalendarPage = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isTodayDisabled, setIsTodayDisabled] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const { user } = useUser();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/signIn");
  }, [isLoaded, isSignedIn, router]);

  // Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && setShowModal(false);
    if (showModal) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Fetch bookings for the current user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        if (!user) throw new Error("User not signed in.");

        const res = await fetch(`/api/event_user/${user.id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch event registrations.");

        const data = await res.json();

        const formatted = data.map((row) => {
          const localDate = row.date.split("T")[0];
          const start = `${localDate}T${row.start_time}`;
          const end = row.end_time ? `${localDate}T${row.end_time}` : null;

          return {
            title: row.title,
            start,
            end,
          };
        });

        setEvents(formatted);
        setBookingData(data);
      } catch (err) {
        console.error("Error loading bookings:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  // Set title and check today's button state
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

  // Handle clicking an event in the calendar
  const handleEventClick = (eventInfo) => {
    const clicked = bookingData.find((item) => {
      const bookingStart = DateTime.fromISO(
        `${item.date.split("T")[0]}T${item.start_time}`
      );
      const eventStart = DateTime.fromISO(eventInfo.event.startStr);
      return (
        item.title === eventInfo.event.title &&
        bookingStart.toISO() === eventStart.toISO()
      );
    });

    if (clicked) {
      setSelectedEvent(clicked);
      setShowModal(true);
    } else {
      console.warn("No matching event found for click");
    }
  };

  // Navigation buttons (prev/next/today/month/week/day)
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

  // Main content
  return (
    <div className="bg-gray-100 min-h-screen">
      <MemberNavbar />

      <h1 className="text-3xl font-bold text-center text-[#E55B3C] mt-6 mb-2 mr-15">
        My Calendar
      </h1>

      {/* just to check if really logined , data is fetched*/}
      {/* {isLoaded && isSignedIn && (
        <div className="text-center mb-4">
          <p className="text-gray-700">User ID: {user?.id}</p>

          {bookingData && bookingData.length > 0 ? (
            <pre className="text-xs text-gray-600 mt-2 text-left mx-auto max-w-lg bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(bookingData, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500 text-sm mt-1">
              (No booking data found)
            </p>
          )}
        </div>
      )} */}

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
            let startTime = "";
            let endTime = "";

            try {
              const start = DateTime.fromISO(event.startStr);
              if (start.isValid) startTime = start.toFormat("h:mm a");

              if (event.end) {
                const end = DateTime.fromISO(event.end);
                if (end.isValid) endTime = end.toFormat("h:mm a");
              }
            } catch {}

            const displayTime = endTime
              ? `${startTime} - ${endTime}`
              : startTime || "End time TBD";

            return (
              <CalenderSmallEvent time={displayTime} title={event.title} />
            );
          }}
        />
        {loading && <p className="text-gray-600 mt-2">Loading…</p>}
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CalendarBigEvent
              workshop={selectedEvent}
              onClose={() => setShowModal(false)}
              onDelete={async () => {
                if (!selectedEvent) return;

                const confirmed = confirm(
                  "Are you sure you want to unregister from this event?"
                );
                if (!confirmed) return;

                try {
                  const res = await fetch("/api/event_user", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      eventId: selectedEvent.id,
                      clerkId: user.id,
                    }),
                  });

                  if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to unregister");
                  }

                  alert("You have successfully unregistered from this event.");
                  window.location.reload(); // reload to reflect backend change
                } catch (err) {
                  alert("Error: " + err.message);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Styling */}
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
