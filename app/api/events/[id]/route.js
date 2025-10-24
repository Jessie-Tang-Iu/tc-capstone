// app/api/events/[id]/route.js
import { NextResponse } from "next/server";
import {
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "@/backend/controllers/eventsController";

// GET /api/events/:id  -> works for public event page & admin
export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const event = await getEventByIdController(Number(id));
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(event, { status: 200 });
  } catch (err) {
    console.error("GET /api/events/[id] failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// PUT /api/events/:id  -> admin edits
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updated = await updateEventController(Number(id), body);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/events/[id] failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// DELETE /api/events/:id -> admin deletes
export async function DELETE(_req, { params }) {
  const { id } = params;
  try {
    await deleteEventController(Number(id));
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/events/[id] failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
