// app/api/events/[id]/route.js
import { NextResponse } from "next/server";
import {
  getEventById,
  updateEventById,
  deleteEventById,
} from "@/backend/database/workshop_crud";

// GET /api/events/:id  -> works for public event page & admin
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const event = await getEventById(Number(id));
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (err) {
    console.error("GET /api/events/[id] failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/events/:id  -> admin edits
export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    // accept both camelCase and snake_case from the client
    const payload = {
      title: body.title,
      date: body.date, // "yyyy-mm-dd"
      start_time: body.start_time ?? body.startTime ?? null,
      end_time: body.end_time ?? body.endTime ?? null,
      location: body.location,
      description: body.description,
      highlight: body.highlight ?? "",
      price: Number(body.price ?? 0),
      // Optional: allow status updates too (e.g., "active" | "completed" | "cancelled")
      status: body.status ?? undefined,
    };

    const updated = await updateEventById(Number(id), payload);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/events/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/events/:id -> admin deletes
export async function DELETE(_req, { params }) {
  const { id } = await params;
  try {
    await deleteEventById(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/events/[id] failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
