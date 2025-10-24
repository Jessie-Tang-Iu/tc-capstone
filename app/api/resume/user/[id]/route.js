import { NextResponse } from "next/server";
import { getResumeByUser, updateResumeByUser } from "@/backend/controllers/resumesController";

// GET /api/resume/user/:id
export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const rs = await getResumeByUser(id);
    return NextResponse.json(rs);
  } catch (e) {
    console.error("GET /api/resume/user/[id] failed: ", e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// PUT /api/resume/user/:id -> update the user's resume
export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ error: "Missing information "}, { status: 400 })
    }

    const updatedResume = await updateResumeByUser(id, body);

    if (updatedResume.rowCount === 0) {
      return NextResponse.json({ error: "Resume not create" }, { status: 404 })
    }

    return NextResponse.json(updateResume.rows[0], { status: 200 })
  } catch (err) {
    console.error("PUT /api/resume/user/[id] failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
