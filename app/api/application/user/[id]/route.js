import { NextResponse } from "next/server";
import { getApplicationsByUser } from "@/backend/controllers/applicationsController";

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