// app/adminDashboard/Event.js (aka EventsPanel)
"use client";

import { useEffect, useState } from "react";
import EventCard from "../components/event/eventCard";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";

export default function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [startTime, setStartTime] = useState(""); // HH:mm (optional)
  const [endTime, setEndTime] = useState(""); // HH:mm (optional)
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [highlight, setHighlight] = useState("");
  const [price, setPrice] = useState(0);

  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("");
  const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // ---- helpers ----
  const getLocalDateTime = (offsetMs = 0) => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - tzOffset * 60 * 1000 + offsetMs);
    return local.toISOString().slice(0, 16); // "yyyy-mm-ddTHH:mm"
  };

  const validate = (d, st, et) => {
    setDateErrorMessage("");
    setStartTimeErrorMessage("");
    setEndTimeErrorMessage("");
    setIsDisabled(false);

    const nowLocal = getLocalDateTime();
    const today = nowLocal.split("T")[0];

    if (d && d < today) {
      setDateErrorMessage("Invalid date");
      setIsDisabled(true);
    }
    if (st && `${d}T${st}` < nowLocal) {
      setStartTimeErrorMessage("Invalid start time");
      setIsDisabled(true);
    }
    if (st && et && `${d}T${et}` <= `${d}T${st}`) {
      setEndTimeErrorMessage("Invalid end time");
      setIsDisabled(true);
    }
  };

  // ---- defaults on mount ----
  useEffect(() => {
    const start = getLocalDateTime();
    const end = getLocalDateTime(2 * 60 * 60 * 1000);
    setDate(start.split("T")[0]);
    setStartTime(start.split("T")[1]);
    setEndTime(end.split("T")[1]);
  }, []);

  // ---- load events from API ----
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    })();
  }, []);

  const handleAddEventButton = () => setIsOpen(true);

  // ---- input handlers (run validation) ----
  const handleDateChange = (e) => {
    const v = e.target.value;
    setDate(v);
    validate(v, startTime, endTime);
  };
  const handleStartTimeChange = (e) => {
    const v = e.target.value;
    setStartTime(v);
    validate(date, v, endTime);
  };
  const handleEndTimeChange = (e) => {
    const v = e.target.value;
    setEndTime(v);
    validate(date, startTime, v);
  };

  // ---- submit -> POST /api/events ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    validate(date, startTime, endTime);
    if (isDisabled) return;

    const payload = {
      title,
      date, // required by DB
      startTime: startTime || null, // null is safe for TIME
      endTime: endTime || null, // null is safe for TIME
      location,
      description,
      highlight,
      price: Number.isFinite(+price) ? +price : 0,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create event");
      const newEvent = await res.json();

      // refresh list at top (or re-fetch GET /api/events if you prefer)
      setEvents((prev) => [newEvent, ...prev]);

      // reset + close
      setIsOpen(false);
      setTitle("");
      setLocation("");
      setDescription("");
      setHighlight("");
      setPrice(0);
      const start = getLocalDateTime();
      const end = getLocalDateTime(2 * 60 * 60 * 1000);
      setDate(start.split("T")[0]);
      setStartTime(start.split("T")[1]);
      setEndTime(end.split("T")[1]);
      setDateErrorMessage("");
      setStartTimeErrorMessage("");
      setEndTimeErrorMessage("");
      setIsDisabled(false);
    } catch (err) {
      console.error(err);
      // surface a simple UI error if you want:
      setDateErrorMessage("Create failed. Check fields and try again.");
    }
  };

  return (
    <main>
      <Button onClick={handleAddEventButton} text="Add Event" />

      {/* List of All Events */}
      <div className="mt-3">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No events found.</div>
        )}
      </div>

      {/* Add Event Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
              <button onClick={() => setIsOpen(false)} title="Close">
                <RxCross2
                  className="cursor-pointer text-gray-600 hover:text-black"
                  size={20}
                />
              </button>

              <h1 className="text-2xl font-bold text-center text-[#E55B3C] mb-2">
                Add Event
              </h1>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col mx-10 my-5"
              >
                <label>Title:</label>
                <input
                  type="text"
                  className="border rounded mb-3 px-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <label>Date:</label>
                <input
                  type="date"
                  className="border rounded px-1"
                  value={date}
                  onChange={handleDateChange}
                  required
                />
                <p className="text-red-400 mb-3">{dateErrorMessage}</p>

                <label>Start Time:</label>
                <input
                  type="time"
                  className="border rounded px-1"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
                <p className="text-red-400 mb-3">{startTimeErrorMessage}</p>

                <label>End Time:</label>
                <input
                  type="time"
                  className="border rounded px-1"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
                <p className="text-red-400 mb-3">{endTimeErrorMessage}</p>

                <label>Location:</label>
                <input
                  type="text"
                  className="border rounded mb-3 px-1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="online | The Platform"
                  required
                />

                <label>Description:</label>
                <textarea
                  className="border rounded h-20 mb-3 px-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <label>Highlight:</label>
                <textarea
                  className="border rounded h-15 mb-3 px-1"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                />

                <label>Price:</label>
                <input
                  type="number"
                  className="border rounded px-1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />

                <Button disabled={isDisabled} text="Submit" />
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
