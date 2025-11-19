import { NextResponse } from "next/server";
import { query } from "@/backend/database/db.js";
import {
  getJobPostById,
  updateJobController,
} from "@/backend/controllers/jobsController.js";

// GET job by id
export async function GET(_req, { params }) {
  const { id } = params;
  try {
    const job = await getJobPostById(Number(id));
    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(job, { status: 200 });
  } catch (err) {
    console.error("GET /api/job/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT job update
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

// PATCH job status (Close Job)
export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    if (!body.status)
      return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const result = await query(
      "UPDATE job SET status = $1 WHERE id = $2 RETURNING *;",
      [body.status, id]
    );

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error("PATCH /api/job/[id] failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
