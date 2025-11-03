import { NextResponse } from "next/server";
import { getApplicationById, updateApplicationStatus } from "@/backend/controllers/applicationsController";

export async function GET(_req, { params }) {
  const { id } = params;
  try {
    const apps = await getApplicationById(Number(id));
    return NextResponse.json(apps);
  } catch (e) {
    console.error("GET /api/application/[id] failed: ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/application/:id -> update the application's status
export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updated = await updateApplicationStatus(Number(id),body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/application/[id] failed: ", e);
    const status = e.message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}