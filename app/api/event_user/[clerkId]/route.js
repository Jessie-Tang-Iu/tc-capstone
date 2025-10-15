import { NextResponse } from "next/server";
import { getEventsByClerkIdController } from "@/backend/controllers/event_userController";

export async function GET(_req, context) {
  const params = await context.params;
  const { clerkId } = params;

  try {
    const result = await getEventsByClerkIdController(clerkId);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("GET /api/event_user/[clerkId] failed:", err);
    const status = err.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
