// app/api/advisor_list/route.js

import { getAllAdvisorsController } from "@/backend/controllers/advisorController";
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
