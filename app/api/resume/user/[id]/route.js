import { NextResponse } from "next/server";
import { getResumeByUser } from "@/backend/controllers/applicationsController";

// GET /api/resume/user/:id
export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const rs = await getResumeByUser(id);
    return NextResponse.json(rs);
  } catch (e) {
    console.error("GET /api/resume/user/[id] failed: ", e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
  } catch (e) {
    
  }
}
