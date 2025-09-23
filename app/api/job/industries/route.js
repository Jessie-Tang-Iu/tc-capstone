import { NextResponse } from "next/server";
import { getJobIndustries } from "@/backend/controllers/jobsController.js";

export async function GET() {
    try {
        const industries = await getJobIndustries();
        return NextResponse.json(industries);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}