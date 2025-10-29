import { NextResponse } from "next/server";
import { getCoverLetterByUser, updateCoverLetterByUser } from "@/backend/controllers/coverLettersController";

// GET /api/resume/user/:id
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const cv = await getCoverLetterByUser(id);
    if (!cv) {
      return NextResponse.json({ error: "Cover letter not create" }, { status: 404 })
    }
    return NextResponse.json(cv);
  } catch (e) {
    console.error("GET /api/cover_letter/user/[id] failed: ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/cover_letter/user/:id -> update the user's cover letter
export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await updateCoverLetterByUser(id, body);
    return NextResponse.json(updated, { status: 200 })
  } catch (e) {
    console.error("PUT /api/cover_letter/user/[id] failed: ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}