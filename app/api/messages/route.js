// app/api/messages/route.js
import { NextResponse } from "next/server";
import {
  getAllMessagesForUserController,
  createMessageController,
} from "@/backend/controllers/messagesController";

// GET /api/messages?userId=123
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const rows = await getAllMessagesForUserController(userId);
    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("GET /api/messages failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/messages
export async function POST(req) {
  try {
    const body = await req.json();
    const msg = await createMessageController(body);
    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    console.error("POST /api/messages failed:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
