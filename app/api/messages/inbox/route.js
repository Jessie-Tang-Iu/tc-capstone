import { NextResponse } from "next/server";
import { getInbox } from "@/backend/database/message_crud";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId)
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );

    const rows = await getInbox(userId);
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET /api/messages/inbox failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
