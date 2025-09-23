import { NextResponse } from "next/server";
import { getJobTypes } from "@/backend/controllers/jobsController.js";

export async function GET() {
    try {
        const types = await getJobTypes();
        return NextResponse.json(types);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}