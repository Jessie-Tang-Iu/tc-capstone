import { NextResponse } from "next/server";
import {
  getAllEvents,
  createEvent,
  updateEventStatus,
} from "@/backend/database/workshop_crud.js";

// GET /api/events → return all events and auto-mark past "active" as "completed"
export async function GET() {
  try {
    let events = await getAllEvents();
    const now = new Date();

    const expired = events.filter(
      (e) => e.status === "active" && new Date(e.date) < now
    );

    if (expired.length) {
      await Promise.all(
        expired.map((e) => updateEventStatus(e.id, "completed"))
      );
      events = await getAllEvents(); // refresh after updates
    }

    return NextResponse.json(events);
  } catch (err) {
    console.error("GET /api/events failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/events → create new event
export async function POST(req) {
  try {
    const body = await req.json();

    // guard against empty strings for TIME/NUMERIC fields
    const payload = {
      ...body,
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      price: body.price ?? 0,
    };

    const newEvent = await createEvent(payload);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error("POST /api/events failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
