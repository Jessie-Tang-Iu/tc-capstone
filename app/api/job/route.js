import { NextResponse } from "next/server";
import {
  getJobsController,
  createJobPost,
} from "@/backend/controllers/jobsController.js";

// GET /api/job → return all jobs and auto-mark past "A" as "I"
export async function GET() {
  try {
    let jobs = await getJobsController();
    const expired = jobs.filter(
      (e) => e.status === "A" && new Date(e.posted_at) > new Date()
    );
    if (expired.length) {
      await Promise.all(expired.map((e) => updateJobStatus(e.id, "I")));
      jobs = await getAllJobPosts(); // refresh after updates
    }
    return NextResponse.json(jobs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/job → create new job
export async function POST(req) {
  try {
    const body = await req.json();

    const newJob = await createJobPost(body);
    return NextResponse.json(newJob, { status: 201 });
  } catch (err) {
    console.error("API POST /job error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
