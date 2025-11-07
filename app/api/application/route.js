import { NextResponse } from "next/server";
import {
  createApplication,
  getAllApplicationsController,
} from "@/backend/controllers/applicationsController";

// POST /api/application/user -> create the application
export async function POST(req) {
  try {
    const body = await req.json();
    // console.log("POST api: ", body);
    const newApp = await createApplication(body);
    return NextResponse.json(newApp, { status: 201 });
  } catch (e) {
    console.log("POST /api/application failed: ", e.message);
    let status = e.message.includes("required") ? 400 : 500;
    status = e.message.includes("constraint") ? 450 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}

// GET /api/application?employer_id=<clerkId>
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employer_id");

    if (!employerId) {
      return NextResponse.json(
        { error: "employer_id required" },
        { status: 400 }
      );
    }

    const apps = await getAllApplicationsController(employerId);
    return NextResponse.json(apps, { status: 200 });
  } catch (e) {
    console.error("GET /api/application failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
