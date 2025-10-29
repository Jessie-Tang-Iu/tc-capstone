import { changeClientStatusController, getMyAdvisorySessionsController, registerAdvisorySessionController } from "@/backend/controllers/advisoryServiceController";
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

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("body", body);
        if (!body.clientId || !body.advisorId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        const registeredAdvisor = await registerAdvisorySessionController(body);
        return NextResponse.json(registeredAdvisor, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/advisory_sessions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        console.log("body", body);
        if (!body.sessionId || !body.status) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        const changeClientStatus = await changeClientStatusController(body.sessionId, body.status);
        return NextResponse.json(changeClientStatus, { status: 201 });
    } catch (error) {
        console.error("Error in PATCH /api/advisory_sessions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
