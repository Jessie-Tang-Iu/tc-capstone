import { getAdvisorySessionsByAdvisorIdController } from "@/backend/controllers/advisoryServiceController";
import { NextResponse } from "next/server";



export async function GET(req) {
    console.log("API route hit!");
    const { searchParams } = new URL(req.url);
    const advisorId = searchParams.get("advisorId");
    console.log("advisorId in route:", advisorId);
    try {
        const myClient = await getAdvisorySessionsByAdvisorIdController(advisorId);
        return NextResponse.json(myClient);
    } catch (e) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
};