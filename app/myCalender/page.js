"use client";

import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DateTime } from "luxon";

import Navbar from "../components/NavBar";
import Button from "../components/ui/Button";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import { getBookingsByUser } from "@/lib/workshop_booking_crud";
import EventCard from "../components/event/eventCard";
import CalendarBigEvent from "../components/myCalender/calenderBig";
import { deleteBookingByWorkshopId } from "@/lib/workshop_booking_crud";

const MyCalendarPage = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isTodayDisabled, setIsTodayDisabled] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const dummyUserId = 1;
        const bookings = await getBookingsByUser(dummyUserId);
        console.log("📦 Bookings returned:", bookings);

        const formatted = bookings.map((item) => ({
          title: item.workshop?.title ?? "Workshop",
          start: `${item.workshop?.date}T${item.workshop?.start_time}`,
        }));

        setEvents(formatted);
        setBookingData(bookings);
        setLoading(false);
      } catch (err) {
        console.error("Error loading bookings:", err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateTitle = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    setCurrentTitle(api.view.title);

    if (api.view.type === "dayGridMonth") {
      const today = new Date();
      const start = api.view.currentStart;
      const end = api.view.currentEnd;
      setIsTodayDisabled(today >= start && today < end);
    } else {
      setIsTodayDisabled(false);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  const handleEventClick = (eventInfo) => {
    console.log(" Clicked event:");
    console.log("  - title:", eventInfo.event.title);
    console.log("  - startStr:", eventInfo.event.startStr);

    const clickedWorkshop = bookingData.find((item) => {
      const bookingStart = DateTime.fromISO(
        `${item.workshop?.date}T${item.workshop?.start_time}`
      );
      const eventStart = DateTime.fromISO(eventInfo.event.startStr);

      return (
        item.workshop?.title === eventInfo.event.title &&
        bookingStart.toISO() === eventStart.toISO()
      );
    });

    if (clickedWorkshop?.workshop) {
      setSelectedEvent(clickedWorkshop.workshop);
      setShowModal(true);
    } else {
      console.warn(" No matching workshop found for event click");
    }
  };

  const handleCalendarNav = (action) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    switch (action) {
      case "prev":
        api.prev();
        break;
      case "next":
        api.next();
        break;
      case "today":
        api.today();
        break;
      case "month":
        api.changeView("dayGridMonth");
        break;
      case "week":
        api.changeView("dayGridWeek");
        break;
      case "day":
        api.changeView("dayGridDay");
        break;
    }

    updateTitle();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

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
          eventClick={handleEventClick} // for the pop up
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
      </div>

      {/* My Booked Workshops */}
      <div className="max-w-screen-lg mx-auto mt-8">
        <h2 className="text-xl font-semibold text-black mb-4">
          My Booked Workshops
        </h2>

        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : bookingData.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            bookingData.map((item) => (
              <EventCard
                key={item.id}
                id={item.id}
                date={`${item.workshop?.date}T${item.workshop?.start_time}`}
                title={item.workshop?.title}
                location="Workshop Location"
                highlight="Upcoming workshop"
                description={`Booked by ${item.users?.firstname || "someone"}`}
              />
            ))
          )}
        </div>
      </div>

      {showModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowModal(false)} // backdrop click closes
        >
          <div
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} // click inside modal does NOT close
          >
            <CalendarBigEvent
              workshop={selectedEvent}
              onClose={() => setShowModal(false)}
              onDelete={() => {
                if (selectedEvent) {
                  const workshopId = selectedEvent.id;
                  const userId = 1; // Replace with actual logged-in user ID if available
                  deleteBookingByWorkshopId(workshopId, userId)
                    .then(() => {
                      // Update UI: remove the event and close the modal
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
                    .catch((err) => {
                      alert("Failed to delete booking: " + err.message);
                    });
                }
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
        .fc .fc-toolbar-title {
          color: black;
        }
        .fc .fc-daygrid-day-number {
          color: black;
        }
        .fc .fc-scrollgrid,
        .fc .fc-daygrid-day-frame {
          border-color: black !important;
        }
        .fc .fc-col-header-cell-cushion {
          color: black;
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
          height: 100px !important; /* adjust this value as needed */
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
