import { NextResponse } from "next/server";
import { createApplication } from "@/backend/controllers/applicationsController";

// POST /api/application/user -> create the application
export async function POST(req) {
  try {
    const body = await req.json();
    // console.log()
    const newApp = await createApplication(body);
    return NextResponse.json(newApp, { status: 201 });
  } catch (e) {
    console.log("POST /api/application failed: ", e.message);
    let status = e.message.includes("required") ? 400 : 500;
    status = e.message.includes("constraint") ? 450 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}