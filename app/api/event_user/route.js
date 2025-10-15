import { NextResponse } from "next/server";
import {
  getAllEventUsersController,
  registerEventUserController,
  cancelEventUserController,
} from "@/backend/controllers/event_userController";

// GET /api/event_user
export async function GET() {
  try {
    const all = await getAllEventUsersController();
    return NextResponse.json(all, { status: 200 });
  } catch (err) {
    console.error("GET /api/event_user failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// POST /api/event_user
// Register a user for an event — expects { eventId, clerkId }
export async function POST(req) {
  try {
    const body = await req.json();
    const { eventId, clerkId } = body;

    if (!eventId || !clerkId) {
      throw new Error("eventId and clerkId required");
    }

    const result = await registerEventUserController(eventId, clerkId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/event_user failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// DELETE /api/event_user
// Cancel a registration — expects { eventId, clerkId }
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { eventId, clerkId } = body;

    if (!eventId || !clerkId) {
      throw new Error("eventId and clerkId required");
    }

    const result = await cancelEventUserController(eventId, clerkId);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/event_user failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
