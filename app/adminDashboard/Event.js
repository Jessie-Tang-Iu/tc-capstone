"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import EventCard from "../components/event/eventCard";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";

/* ========== Helpers ========== */
// Functions for formatting and time-related logic are grouped here for clarity.
const toTimeHM = (t) => {
  if (!t) return "";
  // Handles HH:mm or HH:mm:ss formats
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
  return "";
};

const toDateYMD = (d) => {
  if (!d) return "";
  if (typeof d !== "string") {
    try {
      return new Date(d).toISOString().slice(0, 10); //toISOString returns yyyy-MM-ddTHH:mm:ss.sssZ like 2024-06-15T00:00:00.000Z
    } catch {
      return "";
    }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // Converts dd/MM/yyyy to yyyy-MM-dd
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

const nowLocalYMDHM = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
};

/* ========== Events Panel Component ========== */
export default function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = add, object = edit
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    highlight: "",
    price: 0,
  });

  const [errors, setErrors] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const modalRef = useRef(null); //to detect outside click for the pop up window

  const eventId = useMemo(
    () => editingEvent?.id ?? editingEvent?.event_id ?? null,
    [editingEvent]
  );

  /* ========== API Interactions ========== */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (res.ok) setEvents(await res.json());
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); //Prevents the browser from navigating/reloading when the form submits.
    if (isReadOnly) return;

    const cleanDate = toDateYMD(form.date);
    if (!validate(cleanDate, form.startTime, form.endTime)) return;

    const payload = {
      ...form,
      date: cleanDate,
      start_time: form.startTime || null,
      end_time: form.endTime || null,
      price: Number.isFinite(+form.price) ? +form.price : 0,
    };

    const url = eventId ? `/api/events/${eventId}` : "/api/events";
    const method = eventId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" }, //application/json is a MIME type (Multipurpose Internet Mail Extensions type). It tells the server what format of data is being sent in the HTTP request body.
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Save failed:", res.status, await res.text());
      setErrors((e) => ({ ...e, form: "Create/Update failed." }));
      return;
    }

    const savedEvent = await res.json();

    setEvents((prev) =>
      eventId
        ? prev.map((e) =>
            e.id === eventId || e.event_id === eventId ? savedEvent : e
          )
        : [savedEvent, ...prev]
    );
    closeModal();
  };

  const handleDelete = async () => {
    if (!eventId) return;

    const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Delete failed:", res.status, await res.text());
      setErrors((e) => ({ ...e, form: "Delete failed." }));
      return;
    }

    setEvents((prev) => prev.filter((e) => (e.id ?? e.event_id) !== eventId));
    closeModal();
  };

  /* ========== Form and Modal Logic ========== */
  // Moved validation and handlers here to keep API and UI logic separate.
  const validate = (d, st, et) => {
    const now = nowLocalYMDHM();
    const today = now.split("T")[0];
    const newErrors = { date: "", startTime: "", endTime: "" };
    let hasErrors = false;

    if (d && d < today) {
      newErrors.date = "Date must be in the future.";
      hasErrors = true;
    }
    if (st) {
      const startStamp = `${d}T${st}`;
      if (startStamp < now) {
        newErrors.startTime = "Start time must be in the future.";
        hasErrors = true;
      }
    }
    if (st && et) {
      const startStamp = `${d}T${st}`;
      const endStamp = `${d}T${et}`;
      if (endStamp <= startStamp) {
        newErrors.endTime = "End time must be after start time.";
        hasErrors = true;
      }
    }
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleChange = (key, value) => {
    setForm((prev) => {
      const nextForm = {
        ...prev,
        [key]: key === "price" ? Number(value) : value,
      };
      if (["date", "startTime", "endTime"].includes(key)) {
        validate(nextForm.date, nextForm.startTime, nextForm.endTime);
      }
      return nextForm;
    });
  };

  const isEventPast = (ev) => {
    const d = toDateYMD(ev.date);
    const st = toTimeHM(ev.start_time || ev.startTime || "");
    const et = toTimeHM(ev.end_time || ev.endTime || "") || st || "23:59";
    const endStamp = `${d}T${et}`;
    return endStamp < nowLocalYMDHM();
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingEvent(null);
    setIsReadOnly(false);
    setErrors({ date: "", startTime: "", endTime: "" });
  };

  const openAdd = () => {
    setEditingEvent(null);
    setIsReadOnly(false);
    setIsOpen(true);

    const start = nowLocalYMDHM();
    const end = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    const endLocal = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setForm({
      title: "",
      date: start.split("T")[0],
      startTime: start.split("T")[1],
      endTime: endLocal.split("T")[1],
      location: "",
      description: "",
      highlight: "",
      price: 0,
    });
    setErrors({});
  };

  const openEdit = (raw) => {
    const ev = { ...raw, id: raw.id ?? raw.event_id };
    setEditingEvent(ev);
    setIsReadOnly(isEventPast(ev));
    setIsOpen(true);

    setForm({
      title: ev.title || "",
      date: toDateYMD(ev.date),
      startTime: toTimeHM(ev.start_time || ev.startTime || ""), // frontend and backend have different style conventions.
      endTime: toTimeHM(ev.end_time || ev.endTime || ""),
      location: ev.location || "",
      description: ev.description || "",
      highlight: ev.highlight || "",
      price: Number(ev.price ?? 0),
    });
    setErrors({});
  };

  // Effect for handling keyboard events (Escape key).
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Event handler for clicking on the modal backdrop.
  const onBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
  };

  const getEventStamp = (ev) => {
    const d = toDateYMD(ev.date);
    const t = toTimeHM(ev.start_time || ev.startTime || "00:00");
    // sortable ISO-like "yyyy-mm-ddTHH:mm"
    return `${d}T${t}`;
  };

  // Memoize the sorted list
  const sortedEvents = useMemo(() => {
    const copy = [...events];
    copy.sort((a, b) => {
      const A = getEventStamp(a);
      const B = getEventStamp(b);
      // newest first by default
      return sortOrder === "newest"
        ? A < B
          ? 1
          : A > B
          ? -1
          : 0
        : A < B
        ? -1
        : A > B
        ? 1
        : 0;
    });
    return copy;
  }, [events, sortOrder]);

  /* ========== Render Output ========== */
  return (
    <main>
      <div className="flex items-center justify-between gap-3">
        <Button onClick={openAdd} text="Add Event" />

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C] focus:border-[#E55B3C] transition"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      <div className="mt-3">
        {events.length > 0 ? (
          <div className="space-y-4">
            {sortedEvents.map((ev) => (
              <div
                key={ev.id ?? ev.event_id}
                className="cursor-pointer"
                onClick={() => openEdit(ev)}
              >
                <EventCard {...ev} disableNav onSelect={() => openEdit(ev)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No events found.</div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onMouseDown={onBackdropClick}
        >
          <div
            ref={modalRef} //to detect outside click
            className="w-full max-w-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-[#E55B3C]">
                  {eventId ? "Edit Event" : "Add Event"}
                </h1>
                <div className="flex items-center gap-2">
                  <button onClick={closeModal} title="Close">
                    <RxCross2
                      className="cursor-pointer text-gray-600 hover:text-black"
                      size={20}
                    />
                  </button>
                </div>
              </div>

              {isReadOnly && (
                <div className="mb-4 flex items-start gap-2 rounded-md border border-yellow-500 bg-yellow-100 px-3 py-2 text-yellow-900">
                  <span className="font-semibold">
                    This event has already passed — fields are view-only.
                  </span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex flex-col mx-10 my-5"
              >
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  className={`border rounded mb-3 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  disabled={isReadOnly}
                />

                <label htmlFor="date">Date:</label>
                <input
                  id="date"
                  type="date"
                  className={`border rounded mb-1 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.date}
                  onChange={(e) =>
                    handleChange("date", toDateYMD(e.target.value))
                  }
                  required
                  disabled={isReadOnly}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.date}
                </p>

                <label htmlFor="startTime">Start Time:</label>
                <input
                  id="startTime"
                  type="time"
                  className={`border rounded mb-1 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.startTime}
                  onChange={(e) =>
                    handleChange("startTime", toTimeHM(e.target.value))
                  }
                  disabled={isReadOnly}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.startTime}
                </p>

                <label htmlFor="endTime">End Time:</label>
                <input
                  id="endTime"
                  type="time"
                  className={`border rounded mb-1 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.endTime}
                  onChange={(e) =>
                    handleChange("endTime", toTimeHM(e.target.value))
                  }
                  disabled={isReadOnly}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.endTime}
                </p>

                <label htmlFor="location">Location:</label>
                <input
                  id="location"
                  type="text"
                  className={`border rounded mb-3 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="online | The Platform"
                  required
                  disabled={isReadOnly}
                />

                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  className={`border rounded mb-3 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                  disabled={isReadOnly}
                  placeholder="Full description will show up on the event detail page"
                />

                <label htmlFor="highlight">Highlight:</label>
                <textarea
                  id="highlight"
                  className={`border rounded mb-3 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.highlight}
                  onChange={(e) => handleChange("highlight", e.target.value)}
                  disabled={isReadOnly}
                  placeholder="The highlight will show up bolded on the event card but not inside the detail page"
                />

                <label htmlFor="price">Price:</label>
                <input
                  id="price"
                  type="number"
                  className={`border rounded mb-4 px-2 py-1 ${
                    isReadOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  disabled={isReadOnly}
                />

                <div className="mt-2 flex gap-2">
                  {!isReadOnly && (
                    <button
                      type="submit"
                      className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-40"
                      disabled={
                        !!errors.date || !!errors.startTime || !!errors.endTime
                      }
                    >
                      Save
                    </button>
                  )}
                  {/* The delete button is now only shown once, next to the save button */}
                  {eventId && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-md bg-red-500 text-white px-4 py-2 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
