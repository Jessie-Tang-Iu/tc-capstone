import { NextResponse } from "next/server";
import { getEventById } from "@/backend/database/workshop_crud.js";

export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const event = await getEventById(Number(id));
    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
