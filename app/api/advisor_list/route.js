// app/api/advisor_list/route.js

import { getAllAdvisorsController } from "@/backend/controllers/advisorController";
import { getAdvisorById } from "@/backend/database/scripts/advisor";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("API route hit: /api/advisor_list");

  try {
    const advisors = await getAllAdvisorsController();
    return NextResponse.json(advisors);
  } catch (error) {
    console.error("Error in GET /api/advisor_list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log("API route hit: /api/advisor_list");

  try {
    const body = await request.json();
    if (!body.advisorId) {
      return NextResponse.json({ error: "Missing advisorId" }, { status: 400 });
    }
    const advisors = await getAdvisorById(body.advisorId);
    return NextResponse.json(advisors);
    
  } catch (error) {
    console.error("Error in GET /api/advisor_list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
