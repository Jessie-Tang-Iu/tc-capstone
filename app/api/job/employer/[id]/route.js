import { NextResponse } from "next/server";
import { getJobsByEmployerId } from "@/backend/controllers/jobsController.js";

export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const jobs = await getJobsByEmployerId(Number(id));
    return NextResponse.json(jobs);
  } catch (e) {
    return NextResponse.json({ error: e.message}, { status: 500 });
  }
}
