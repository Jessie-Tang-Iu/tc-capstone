import { NextResponse } from "next/server";
import { getResumeByUser } from "@/backend/database/scripts/application_crud.js";

export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const re = await getResumeByUser(Number(id));
    return NextResponse.json(re);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
