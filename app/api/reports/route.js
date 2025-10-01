import {
  getReportsController,
  createReportController as createReport,
} from "@/backend/controllers/reportsController.js";

export async function GET() {
  try {
    const reports = await getReportsController();

    const normalized = reports.map((r) => ({
      reportId: r.report_id,
      category: r.source_page,
      reporter: r.reported_user_id,
      issue: r.reason,
      timeAgo: new Date(r.created_at).toLocaleString(),
      isRemoved: r.is_removed,
      isBanned: r.is_banned,
      publicCode: r.public_code,
    }));

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newReport = await createReport(body);

    const normalized = {
      reportId: newReport.report_id,
      category: newReport.source_page,
      reporter: newReport.reported_user_id,
      issue: newReport.reason,
      timeAgo: new Date(newReport.created_at).toLocaleString(),
      isRemoved: newReport.is_removed,
      isBanned: newReport.is_banned,
      publicCode: newReport.public_code,
    };

    return new Response(JSON.stringify(normalized), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
