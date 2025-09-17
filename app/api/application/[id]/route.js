import { NextResponse } from "next/server";
import { getApplicationById } from "@/backend/database/application_crud.js";

export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const apps = await getApplicationById(Number(id));
    return NextResponse.json(apps);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
