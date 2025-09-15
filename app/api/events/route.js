import { NextResponse } from "next/server";
import { getAllEvents, createEvent } from "@/backend/database/workshop_crud.js";

// GET /api/events → return all events
export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/events → create new event
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Incoming POST body:", body); // log input
    const newEvent = await createEvent(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error("API POST /api/events failed:", err.stack || err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
