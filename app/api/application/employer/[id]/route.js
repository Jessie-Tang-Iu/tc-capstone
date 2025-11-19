import { NextResponse } from "next/server";
import { getAllApplicationsByEmployerController } from "@/backend/controllers/applicationsController";

export async function GET(req, { params }) {
  try {
    const data = await getAllApplicationsByEmployerController(params.id);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
