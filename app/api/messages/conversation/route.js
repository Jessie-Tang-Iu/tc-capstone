// app/api/messages/conversation/route.js
import { NextResponse } from "next/server";
import {
  getConversationController,
  markReadByPairController,
} from "@/backend/controllers/messagesController";

// GET /api/messages/conversation?userA=...&userB=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userA = searchParams.get("userA");
    const userB = searchParams.get("userB");

    if (!userA || !userB) {
      return NextResponse.json(
        { error: "userA and userB are required" },
        { status: 400 }
      );
    }

    const rows = await getConversationController(userA, userB);
    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("GET /api/messages/conversation failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/messages/conversation
// body: { fromUser, toUser } -> mark messages from fromUser -> toUser as read
export async function POST(req) {
  try {
    const { fromUser, toUser } = await req.json();

    if (!fromUser || !toUser) {
      return NextResponse.json(
        { error: "fromUser and toUser are required" },
        { status: 400 }
      );
    }

    const updated = await markReadByPairController({ fromUser, toUser });
    return NextResponse.json(
      { updated: updated.map((r) => r.id) },
      { status: 200 }
    );
  } catch (e) {
    console.error("POST /api/messages/conversation failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

//chatwindow
