import { NextResponse } from "next/server";
import {
  getAllReportsController,
  createReportController,
} from "@/backend/controllers/reportsController.js";

/**
 * GET /api/reports
 * - Return all reports (newest first)
 * - Supports ?limit=&offset= for pagination
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const rows = await getAllReportsController({
      limit: limit != null ? Number(limit) : undefined,
      offset: offset != null ? Number(offset) : undefined,
    });

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/reports failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/reports
 * - Create a new report
 * - Body: { source_page, reported_user_id, reason, followup_id?, is_removed?, is_banned?, public_code? }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const created = await createReportController(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/reports failed:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
