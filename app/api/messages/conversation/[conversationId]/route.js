import { NextResponse } from "next/server";
import { deleteConversationController } from "@/backend/controllers/messagesController";

// DELETE /api/messages/conversation/:conversationId
export async function DELETE(_req, context) {
  try {
    const { conversationId } = await context.params;
    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    await deleteConversationController(conversationId);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(
      "DELETE /api/messages/conversation/[conversationId] failed:",
      e
    );
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
