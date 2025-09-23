import { NextResponse } from "next/server";
import { getCoverLetterByUser } from "@/backend/controllers/applicationsController";

// GET /api/resume/user/:id
export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const cv = await getCoverLetterByUser(Number(id));
    return NextResponse.json(cv);
  } catch (e) {
    console.error("GET /api/cover_letter/user/[id] failed: ", e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
  } catch (e) {
    
  }
}
