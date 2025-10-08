import { NextResponse } from "next/server";
import { getApplicationsByUser, createApplication, updateApplicationStatus } from "@/backend/controllers/applicationsController";

// GET /api/application/user/:id 
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const apps = await getApplicationsByUser(id);
    return NextResponse.json(apps);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// POST /api/application/user/:id -> create the application
export async function POST(req) {
  try {
    const body = await req.json();
    console.log()
    const newApp = await createApplication(body);
    return NextResponse.json(newApp, { status: 201 });
  } catch (e) {
    // console.log("POST /api/application/user/[id] failed: ", e.message);
    let status = e.message.includes("required") ? 400 : 500;
    status = e.message.includes("constraint") ? 450 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}


