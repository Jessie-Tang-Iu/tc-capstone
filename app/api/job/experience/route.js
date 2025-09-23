import { NextResponse } from "next/server";
import { getJobExperience } from "@/backend/controllers/jobsController.js";

export async function GET() {
    try {
        const experience = await getJobExperience();
        return NextResponse.json(experience);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}