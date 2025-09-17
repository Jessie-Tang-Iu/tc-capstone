import { getBookingsController } from "@/backend/controllers/advisoryServiceController";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const advisorId = searchParams.get("advisorId");
  try {
    const booking = await getBookingsController(advisorId);
    return NextResponse.json(booking);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
};
