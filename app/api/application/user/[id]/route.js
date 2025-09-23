import { NextResponse } from "next/server";
import { getApplicationsByUser, createApplication, updateApplicationStatus } from "@/backend/controllers/applicationsController";

// GET /api/application/user/:id 
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const apps = await getApplicationsByUser(Number(id));
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
    console.error("POST /api/application/user/[id] failed: ", e);
    const status = e.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}

// PATCH /api/application/user/:id -> update the application's status
export async function PATCH(req, { params }) {
  const { id } = await params;
  const userId = Number(id);
  try {
    const body = await req.json();
    const updated = await updateApplicationStatus(body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/application/user/[id] failed: ", e);
    const status = e.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
