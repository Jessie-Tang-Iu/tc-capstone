"use client";

import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Navbar from "../components/NavBar";
import Button from "../components/ui/Button";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import { DateTime } from "luxon";

const MyCalendarPage = () => {
  const calendarRef = useRef(null);
  const [events] = useState([
    {
      title: "Advisory Session with John Doe",
      start: "2025-06-24T11:00:00",
    },
    {
      title: "Ace the Interview: Confidence, Motifs, Strategy",
      start: "2025-06-27T18:00:00",
    },
  ]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isTodayDisabled, setIsTodayDisabled] = useState(false);

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

      {/* Custom Toolbar */}
      <div className="max-w-screen-md mx-auto px-4 flex justify-between items-center mb-4">
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

      <div className="max-w-screen-md mx-auto bg-white p-4 rounded shadow-md">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={false}
          height="auto"
          contentHeight="auto"
          eventContent={({ event }) => {
            const dateTime = DateTime.fromISO(event.startStr);
            const timeStr = dateTime.toFormat("h:mm a");
            return <CalenderSmallEvent time={timeStr} title={event.title} />;
          }}
        />
      </div>

      {/* Calendar dark style override */}
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
          background-color: #e55b3c;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MyCalendarPage;
