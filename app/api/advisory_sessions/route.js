import { getMyAdvisorySessionsController } from "@/backend/controllers/advisoryServiceController";
import { NextResponse } from "next/server";


export async function GET(req) {
    console.log("API route hit!");
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    console.log("ClientID in route:", clientId);
    try {
        const myAdvisor = await getMyAdvisorySessionsController(clientId);
        return NextResponse.json(myAdvisor);
    } catch (e) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
};
