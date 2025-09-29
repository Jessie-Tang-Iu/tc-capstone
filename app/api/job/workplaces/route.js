import { NextResponse } from "next/server";
import { getJobWorkplaces } from "@/backend/controllers/jobsController.js";

export async function GET() {
    try {
        const workplaces = await getJobWorkplaces();
        return NextResponse.json(workplaces);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}