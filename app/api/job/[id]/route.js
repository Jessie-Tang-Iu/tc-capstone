import { NextResponse } from "next/server";
import {
  getJobPostById,
  updateJobController,
} from "@/backend/controllers/jobsController.js";

// GET /api/job/[id]
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const job = await getJobPostById(Number(id));
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job, { status: 200 });
  } catch (err) {
    console.error("GET /api/job/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/job/[id]
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updatedJob = await updateJobController(Number(params.id), body);
    return NextResponse.json(updatedJob, { status: 200 });
  } catch (err) {
    console.error("PUT /api/job/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
