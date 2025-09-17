// app/api/messages/inbox/route.js
import { NextResponse } from "next/server";
import {
  getInboxController,
  deleteMessageController,
} from "@/backend/controllers/messagesController";

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

    const rows = await getInboxController(userId);
    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("GET /api/messages/inbox failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// app/api/messages/inbox/route.js
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await deleteMessageController(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("DELETE /api/messages/inbox failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

//UI: overview (like WhatsApp’s chat list).
