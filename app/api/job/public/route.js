import { NextResponse } from "next/server";
import { getAllJobPostsPublicController } from "@/backend/controllers/jobsController.js";

// GET /api/job/public → open to all users
export async function GET() {
  try {
    const jobs = await getAllJobPostsPublicController();
    return NextResponse.json(jobs, { status: 200 });
  } catch (err) {
    console.error("GET /api/job/public error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
