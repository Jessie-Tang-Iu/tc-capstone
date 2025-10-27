"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import EventCard from "../components/event/eventCard";
import Button from "../components/ui/Button";
import EventFormPanel from "../components/adminDashboard/EventFormPanel";
import SearchBar from "../components/ui/SearchBar";

/* ========== Helpers ========== */
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

/* ========== Component ========== */
export default function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [query, setQuery] = useState("");

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

  const modalRef = useRef(null);

  const eventId = useMemo(
    () => editingEvent?.id ?? editingEvent?.event_id ?? null,
    [editingEvent]
  );

  /* ========== Fetch Events ========== */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (res.ok) setEvents(await res.json());
    })();
  }, []);

  /* ========== CRUD Operations ========== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const cleanDate = toDateYMD(form.date);
    if (!validate(cleanDate, form.startTime, form.endTime)) return;

    const payload = {
      ...form,
      date: cleanDate,
      start_time: form.startTime?.trim() ? form.startTime : null,
      end_time: form.endTime?.trim() ? form.endTime : null,
      price: Number.isFinite(+form.price) ? +form.price : 0,
    };

    const url = eventId ? `/api/events/${eventId}` : "/api/events";
    const method = eventId ? "PUT" : "POST";

    Object.keys(payload).forEach((k) => {
      if (payload[k] === "" || payload[k] === undefined) payload[k] = null;
    });

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
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

  /* ========== Form Logic ========== */
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
      const next = {
        ...prev,
        [key]: key === "price" ? Number(value) : value,
      };
      if (["date", "startTime", "endTime"].includes(key)) {
        validate(next.date, next.startTime, next.endTime);
      }
      return next;
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
      startTime: toTimeHM(ev.start_time || ev.startTime || ""),
      endTime: toTimeHM(ev.end_time || ev.endTime || ""),
      location: ev.location || "",
      description: ev.description || "",
      highlight: ev.highlight || "",
      price: Number(ev.price ?? 0),
    });
    setErrors({});
  };

  /* ========== Sorting + Search ========== */
  const getEventStamp = (ev) => {
    const d = toDateYMD(ev.date);
    const t = toTimeHM(ev.start_time || ev.startTime || "00:00");
    return `${d}T${t}`;
  };

  const sortedEvents = useMemo(() => {
    const copy = [...events];
    copy.sort((a, b) => {
      const A = getEventStamp(a);
      const B = getEventStamp(b);
      return sortOrder === "newest" ? (A < B ? 1 : -1) : A < B ? -1 : 1;
    });
    return copy;
  }, [events, sortOrder]);

  const filteredEvents = useMemo(() => {
    const q = query.toLowerCase();
    return sortedEvents.filter(
      (ev) =>
        ev.title?.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q)
    );
  }, [sortedEvents, query]);

  /* ========== Render ========== */
  return (
    <main>
      {/* Top Header Section */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C] text-center">
          Event Management
        </div>

        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <Button onClick={openAdd} text="Add Event" />
          <div className="flex justify-center">
            <SearchBar
              placeholder="Search by title or location"
              value={query}
              onChange={setQuery}
              onSearch={() => {}}
            />
          </div>
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
      </div>

      {/* Event list or form */}
      <div>
        {isOpen ? (
          <EventFormPanel
            eventId={eventId}
            form={form}
            errors={errors}
            isReadOnly={isReadOnly}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onClose={closeModal}
          />
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-4 h-[700px] overflow-y-auto pr-2">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id ?? ev.event_id}
                className="cursor-pointer"
                onClick={() => openEdit(ev)}
              >
                <EventCard {...ev} disableNav />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center mt-10">
            No events found.
          </div>
        )}
      </div>
    </main>
  );
}
