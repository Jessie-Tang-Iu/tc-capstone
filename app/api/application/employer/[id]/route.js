import { NextResponse } from "next/server";
import { getAllApplicationsbyEmployerController } from "@/backend/controllers/applicationsController";

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const data = await getAllApplicationsbyEmployerController(id);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
