import { NextResponse } from "next/server";
import { getJobPostById } from "@/backend/controllers/jobsController.js";

// GET /api/job → return all jobs and auto-mark past "A" as "I"
export async function GET(_req, { params }) {
  const { id } = await params;
    try {
        let job = await getJobPostById(Number(id));
        return NextResponse.json(job);
    } catch (err) {
        return NextResponse({ error: err.message }, { status: 500 });
    }
}