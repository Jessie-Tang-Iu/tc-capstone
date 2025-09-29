import { query } from "../../database/db.js";

// Get all reports ordered by most recently created
export async function getAllReports() {
  const result = await query("SELECT * FROM reports ORDER BY created_at DESC");
  return result.rows;
}

// Get a single report by internal report_id
export async function getReportById(reportId) {
  const result = await query("SELECT * FROM reports WHERE report_id = $1", [
    reportId,
  ]);
  return result.rows[0];
}

// Create a new report
export async function createReport(
  source_page,
  followup_id,
  reported_user_id,
  reason,
  public_code = null
) {
  const result = await query(
    `INSERT INTO reports
       (source_page, followup_id, reported_user_id, reason, public_code)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [source_page, followup_id, reported_user_id, reason, public_code]
  );
  return result.rows[0];
}

// Soft remove (mark report removed)
export async function markReportRemoved(reportId, isRemoved = true) {
  const result = await query(
    `UPDATE reports
        SET is_removed = $1
      WHERE report_id = $2
  RETURNING *`,
    [isRemoved, reportId]
  );
  return result.rows[0];
}

// Mark reported user as banned (from this report row’s perspective)
export async function markReportedBanned(reportId, isBanned = true) {
  const result = await query(
    `UPDATE reports
        SET is_banned = $1
      WHERE report_id = $2
  RETURNING *`,
    [isBanned, reportId]
  );
  return result.rows[0];
}

export async function deleteReportById(reportId) {
  await query("DELETE FROM reports WHERE report_id = $1", [reportId]);
  return { success: true };
}

// Get a report by public 8-digit code
export async function getReportByPublicCode(publicCode) {
  const result = await query("SELECT * FROM reports WHERE public_code = $1", [
    publicCode,
  ]);
  return result.rows[0];
}

// Update report (partial update)
export async function updateReportById(reportId, patch) {
  const { source_page, followup_id, reason, public_code } = patch;

  const result = await query(
    `UPDATE reports
        SET source_page = COALESCE($1, source_page),
            followup_id = COALESCE($2, followup_id),
            reason = COALESCE($3, reason),
            public_code = COALESCE($4, public_code),
            updated_at = NOW()
      WHERE report_id = $5
  RETURNING *`,
    [
      source_page ?? null,
      followup_id ?? null,
      reason ?? null,
      public_code ?? null,
      reportId,
    ]
  );

  return result.rows[0];
}
