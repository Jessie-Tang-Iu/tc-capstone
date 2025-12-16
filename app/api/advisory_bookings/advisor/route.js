import { getBookingsController, getBookingsByClientIdController } from "@/backend/controllers/advisoryServiceController";
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

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  try {
    const session = await getBookingsByClientIdController(clientId);
    return NextResponse.json(session);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
