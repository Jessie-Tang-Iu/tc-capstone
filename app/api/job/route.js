import { NextResponse } from "next/server";
import {
  getAllJobPosts,
  createJobPost,
} from "@/backend/database/scripts/job_crud.js";

// GET /api/jobs → return all jobs and auto-mark past "A" as "I"
export async function GET() {
    try {
        let jobs = await getAllJobPosts();
        const expired = jobs.filter(
            (e) => e.status === "A" && new Date(e.posted_at) > new Date()
        );
        if (expired.length) {
            await Promise.all(
                expired.map((e) => updateJobStatus(e.id, "I"))
            );
            jobs = await getAllJobPosts(); // refresh after updates
        }
        return NextResponse.json(jobs);
    } catch (err) {
        console.error("GET /api/job failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/jobs → create new job
export async function POST(req) {
    try {
        const body = await req.json();

        // guard against empty strings for TIME/NUMERIC fields
        // const payload = {
        //     ...body,
        //     status: body.salaryPerHour || null,
        // };

        const newJob = await createJobPost(body);
        return NextResponse.json(newJob, { status: 201 });
    } catch (err) {
        console.error("POST /api/job failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}