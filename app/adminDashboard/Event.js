// app/adminDashboard/Event.js
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import EventCard from "../components/event/eventCard";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";

/* ========== helpers (formatting) ========== */
const toTimeHM = (t) => {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
  return "";
};

const toDateYMD = (d) => {
  if (!d) return "";
  if (typeof d !== "string") {
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // dd/MM/yyyy
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
  return local.toISOString().slice(0, 16); // yyyy-mm-ddTHH:mm
};

const toLocalStamp = (dateYMD, timeHM = "23:59") =>
  `${toDateYMD(dateYMD)}T${toTimeHM(timeHM) || "23:59"}`;

/* ========== component ========== */
export default function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = add
  const [readOnly, setReadOnly] = useState(false); // true for past events

  const [form, setForm] = useState({
    title: "",
    date: "", // yyyy-mm-dd
    startTime: "", // HH:mm
    endTime: "", // HH:mm
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

  const modalRef = useRef(null);

  /* ------- load events ------- */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (res.ok) setEvents(await res.json());
    })();
  }, []);

  /* ------- validation (future only) ------- */
  const validate = (d, st, et) => {
    const nowLocal = nowLocalYMDHM();
    const today = nowLocal.split("T")[0];

    const next = { date: "", startTime: "", endTime: "" };
    let bad = false;

    if (d && d < today) {
      next.date = "Date must be in the future.";
      bad = true;
    }
    if (st) {
      const startStamp = `${d}T${st}`;
      if (startStamp < nowLocal) {
        next.startTime = "Start time must be in the future.";
        bad = true;
      }
    }
    if (st && et) {
      const startStamp = `${d}T${st}`;
      const endStamp = `${d}T${et}`;
      if (endStamp <= startStamp) {
        next.endTime = "End time must be after start time.";
        bad = true;
      }
    }

    setErrors(next);
    return !bad;
  };

  const handleChange = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: key === "price" ? Number(value) : value };
      if (key === "date" || key === "startTime" || key === "endTime") {
        validate(next.date, next.startTime, next.endTime);
      }
      return next;
    });
  };

  /* ------- modal open/close + ESC/backdrop ------- */
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditingEvent(null);
    setReadOnly(false);
    setErrors({ date: "", startTime: "", endTime: "" });
  };

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const onBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
  };

  /* ------- helpers about event timing ------- */
  const isEventPast = (ev) => {
    const d = toDateYMD(ev.date);
    const st = toTimeHM(ev.start_time || ev.startTime || "");
    const et = toTimeHM(ev.end_time || ev.endTime || "") || st || "23:59";
    const endStamp = toLocalStamp(d, et);
    return endStamp < nowLocalYMDHM();
  };

  /* ------- open add ------- */
  const openAdd = () => {
    setEditingEvent(null);
    setReadOnly(false);
    openModal();

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
    setErrors({ date: "", startTime: "", endTime: "" });
  };

  /* ------- open edit (normalize id!) ------- */
  const openEdit = (raw) => {
    const ev = { ...raw, id: raw.id ?? raw.event_id }; // normalize id
    setEditingEvent(ev);
    setReadOnly(isEventPast(ev));
    setIsOpen(true);

    setForm({
      title: ev.title || "",
      date: toDateYMD(ev.date),
      startTime: toTimeHM(ev.start_time || ev.startTime || ""),
      endTime: toTimeHM(ev.end_time || ev.endTime || ""),
      location: ev.location || "",
      description: ev.description || "",
      highlight: ev.highlight || "",
      price: Number(ev.price ?? 0),
    });
    setErrors({ date: "", startTime: "", endTime: "" });
  };

  /* A stable event id for rendering/requests */
  const eventId = useMemo(
    () =>
      editingEvent?.id ?? editingEvent?.event_id ?? editingEvent?._uuid ?? null,
    [editingEvent]
  );

  /* ------- save (POST/PUT) ------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return;

    const cleanDate = toDateYMD(form.date);
    if (!validate(cleanDate, form.startTime, form.endTime)) return;

    const payload = {
      title: form.title,
      date: cleanDate,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      // include snake_case too if backend expects it
      start_time: form.startTime || null,
      end_time: form.endTime || null,
      location: form.location,
      description: form.description,
      highlight: form.highlight,
      price: Number.isFinite(+form.price) ? +form.price : 0,
    };

    const url = eventId ? `/api/events/${eventId}` : "/api/events";
    const method = eventId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Save failed", res.status, await res.text());
      setErrors((e) => ({ ...e, date: "Create/Update failed." }));
      return;
    }

    const saved = await res.json();
    setEvents((prev) =>
      eventId
        ? prev.map((x) =>
            x.id === eventId || x.event_id === eventId ? saved : x
          )
        : [saved, ...prev]
    );
    closeModal();
  };

  /* ------- delete ------- */
  const handleDelete = async () => {
    if (!eventId) return;
    const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Delete failed", res.status, await res.text());
      setErrors((e) => ({ ...e, date: "Delete failed." }));
      return;
    }
    setEvents((prev) => prev.filter((x) => (x.id ?? x.event_id) !== eventId));
    closeModal();
  };

  /* ------- render ------- */
  return (
    <main>
      <Button onClick={openAdd} text="Add Event" />

      <div className="mt-3">
        {events.length ? (
          <div className="space-y-4">
            {events.map((ev) => (
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
            ref={modalRef}
            className="w-full max-w-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
              {/* Header with Delete always visible in edit mode */}
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

              {readOnly && (
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
                <label>Title:</label>
                <input
                  type="text"
                  className={`border rounded mb-3 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  disabled={readOnly}
                />

                <label>Date:</label>
                <input
                  type="date"
                  className={`border rounded mb-1 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.date}
                  onChange={(e) =>
                    handleChange("date", toDateYMD(e.target.value))
                  }
                  required
                  disabled={readOnly}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {readOnly ? "" : errors.date}
                </p>

                <label>Start Time:</label>
                <input
                  type="time"
                  className={`border rounded mb-1 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.startTime}
                  onChange={(e) =>
                    handleChange("startTime", toTimeHM(e.target.value))
                  }
                  disabled={readOnly}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {readOnly ? "" : errors.startTime}
                </p>

                <label>End Time:</label>
                <input
                  type="time"
                  className={`border rounded mb-1 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.endTime}
                  onChange={(e) =>
                    handleChange("endTime", toTimeHM(e.target.value))
                  }
                  disabled={readOnly}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {readOnly ? "" : errors.endTime}
                </p>

                <label>Location:</label>
                <input
                  type="text"
                  className={`border rounded mb-3 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="online | The Platform"
                  required
                  disabled={readOnly}
                />

                <label>Description:</label>
                <textarea
                  className={`border rounded mb-3 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                  disabled={readOnly}
                  placeholder="Full description will show up on the event detail page"
                />

                <label>Highlight:</label>
                <textarea
                  className={`border rounded mb-3 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.highlight}
                  onChange={(e) => handleChange("highlight", e.target.value)}
                  disabled={readOnly}
                  placeholder="The highlight will show up bolded on the event card but not inside the detail page"
                />

                <label>Price:</label>
                <input
                  type="number"
                  className={`border rounded mb-4 px-2 py-1 ${
                    readOnly ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  disabled={readOnly}
                />

                <div className="mt-2 flex gap-2">
                  {!readOnly && (
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
