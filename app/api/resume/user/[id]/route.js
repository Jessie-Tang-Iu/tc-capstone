import { NextResponse } from "next/server";
import { getResumeByUser } from "@/backend/scripts/applications.js";

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const rs = await getResumeByUser(Number(id));
    return NextResponse.json(rs);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
  } catch (e) {
    
  }
}
