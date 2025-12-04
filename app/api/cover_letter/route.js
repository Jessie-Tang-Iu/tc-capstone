import { NextResponse } from "next/server";
import { createCoverLetter } from "@/backend/controllers/coverLettersController";

// POST /api/cover_letter/user -> create the cover letter
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("POST cover letter: ", body);

    if (!body.content) {
      return NextResponse.json({ error: "Missing information" }, { status: 400 });
    }

    const updated = await createCoverLetter(body);
    return NextResponse.json(updated, { status: 201 })
    // return NextResponse.json(newCV, { status: 201 });
  } catch (e) {
    console.error("POST /api/cover_letter failed: ", e);
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}