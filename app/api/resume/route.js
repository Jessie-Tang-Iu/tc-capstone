import { NextResponse } from "next/server";
import { createResume } from "@/backend/controllers/resumesController";

// POST /api/resume -> create the resume
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("New resume: ", body);
    const newResume = await createResume(body);
    return NextResponse.json(newResume, { status: 201 });
  } catch (err) {
    console.error("POST /api/resume failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}