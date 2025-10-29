import { NextResponse } from "next/server";
import { getResumeByUser, updateResumeByUser } from "@/backend/controllers/resumesController";

// GET /api/resume/user/:id
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const result = await getResumeByUser(id);
    if (!result) {
      return NextResponse.json({ error: "Resume not create" }, { status: 404 })
    }
    return NextResponse.json(result, { status: 200});
  } catch (e) {
    console.error("GET /api/resume/user/[id] failed: ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/resume/user/:id -> update the user's resume
export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updatedResume = await updateResumeByUser(id, body);
    return NextResponse.json(updatedResume, { status: 200 })
  } catch (err) {
    console.error("PUT /api/resume/user/[id] failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
