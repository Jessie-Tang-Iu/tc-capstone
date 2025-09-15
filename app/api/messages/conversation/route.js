import { NextResponse } from "next/server";
import {
  getConversation,
  markReadByPair, // marks all messages from A -> B as read
} from "@/backend/database/message_crud";

// GET /api/messages/conversation?userA=...&userB=...
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userA = searchParams.get("userA");
  const userB = searchParams.get("userB");
  if (!userA || !userB) {
    return NextResponse.json(
      { error: "userA and userB are required" },
      { status: 400 }
    );
  }
  const rows = await getConversation(userA, userB);
  return NextResponse.json(rows);
}

// POST /api/messages/conversation
// body: { fromUser, toUser }  -> mark messages from fromUser -> toUser as read
export async function POST(req) {
  try {
    const { fromUser, toUser } = await req.json();
    if (!fromUser || !toUser) {
      return NextResponse.json(
        { error: "fromUser and toUser are required" },
        { status: 400 }
      );
    }
    const updated = await markReadByPair({ fromUser, toUser });
    return NextResponse.json({ updated: updated.map((r) => r.id) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
