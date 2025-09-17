import { getBookingsByAdvisorId } from "@/backend/database/advisory_bookings_crud";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const advisorId = searchParams.get("advisorId");
  try {
    const event = await getBookingsByAdvisorId(advisorId);
    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
};
