// app/api/messages/route.js
import { NextResponse } from "next/server";
import {
  getAllMessagesForUser,
  createMessage,
} from "@/backend/database/message_crud";

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
    const rows = await getAllMessagesForUser(userId);
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET /api/messages failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { sent_user_id, receive_user_id, content, status } = body || {};
    if (!sent_user_id || !receive_user_id || !content) {
      return NextResponse.json(
        { error: "sent_user_id, receive_user_id, content are required" },
        { status: 400 }
      );
    }
    const msg = await createMessage({
      sent_user_id,
      receive_user_id,
      content,
      status,
    });
    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    console.error("POST /api/messages failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
