import { query } from "../../database/db.js";

/** List reports (newest first) */
export async function getAllReports({ limit = 100, offset = 0 } = {}) {
  const sql = `
    SELECT report_id,
           public_code,
           source_page,
           followup_id,
           reported_user_id,
           reason,
           is_removed,
           is_banned,
           created_at,
           updated_at
      FROM reports
  ORDER BY created_at DESC
     LIMIT $1 OFFSET $2
  `;
  const result = await query(sql, [Number(limit), Number(offset)]);
  return result.rows;
}

/** Get a report by internal ID */
export async function getReportById(reportId) {
  const sql = `
    SELECT report_id,
           public_code,
           source_page,
           followup_id,
           reported_user_id,
           reason,
           is_removed,
           is_banned,
           created_at,
           updated_at
      FROM reports
     WHERE report_id = $1
  `;
  const result = await query(sql, [reportId]);
  return result.rows[0];
}

/** Get a report by public 8-digit code */
export async function getReportByPublicCode(publicCode) {
  const sql = `
    SELECT report_id,
           public_code,
           source_page,
           followup_id,
           reported_user_id,
           reason,
           is_removed,
           is_banned,
           created_at,
           updated_at
      FROM reports
     WHERE public_code = $1
  `;
  const result = await query(sql, [publicCode]);
  return result.rows[0];
}

/** Create a new report */
export async function createReport(r) {
  const sql = `
    INSERT INTO reports
      (source_page, followup_id, reported_user_id, reason, is_removed, is_banned, public_code)
    VALUES
      ($1, $2, $3, $4, COALESCE($5, FALSE), COALESCE($6, FALSE), $7)
    RETURNING report_id,
              public_code,
              source_page,
              followup_id,
              reported_user_id,
              reason,
              is_removed,
              is_banned,
              created_at,
              updated_at
  `;
  const params = [
    r.source_page,
    r.followup_id ?? null,
    r.reported_user_id, // UUID or INT depending on schema
    r.reason, // must pass CHECK list value
    r.is_removed ?? false,
    r.is_banned ?? false,
    r.public_code ?? null, // if null, insert without a code; fill in app or DB trigger
  ];
  const result = await query(sql, params);
  return result.rows[0];
}

/** Update report reason/followup/source_page (and optionally public_code) */
export async function updateReportById(reportId, r) {
  // Partial update pattern: set provided fields, keep others
  const sql = `
    UPDATE reports
       SET source_page      = COALESCE($1, source_page),
           followup_id      = COALESCE($2, followup_id),
           reason           = COALESCE($3, reason),
           public_code      = COALESCE($4, public_code),
           updated_at       = NOW()
     WHERE report_id = $5
 RETURNING report_id,
           public_code,
           source_page,
           followup_id,
           reported_user_id,
           reason,
           is_removed,
           is_banned,
           created_at,
           updated_at
  `;
  const params = [
    r.source_page ?? null,
    r.followup_id ?? null,
    r.reason ?? null,
    r.public_code ?? null,
    reportId,
  ];
  const result = await query(sql, params);
  return result.rows[0];
}

/** Mark a report as removed (soft action) */
export async function markReportRemoved(reportId, isRemoved = true) {
  const sql = `
    UPDATE reports
       SET is_removed = $1,
           updated_at = NOW()
     WHERE report_id = $2
 RETURNING report_id,
           public_code,
           is_removed,
           updated_at
  `;
  const result = await query(sql, [Boolean(isRemoved), reportId]);
  return result.rows[0];
}

/** Mark the reported user as banned (flag on this report row) */
export async function markReportedBanned(reportId, isBanned = true) {
  const sql = `
    UPDATE reports
       SET is_banned  = $1,
           updated_at = NOW()
     WHERE report_id = $2
 RETURNING report_id,
           public_code,
           is_banned,
           updated_at
  `;
  const result = await query(sql, [Boolean(isBanned), reportId]);
  return result.rows[0];
}

/** Hard delete a report by ID */
export async function deleteReportById(reportId) {
  await query(`DELETE FROM reports WHERE report_id = $1`, [reportId]);
}

/** Optional: filter by fields (simple example) */
export async function findReports({
  reason,
  is_removed,
  is_banned,
  reported_user_id,
  since,
  until,
  limit = 100,
  offset = 0,
} = {}) {
  const where = [];
  const params = [];
  let i = 1;

  if (reason) {
    where.push(`reason = $${i++}`);
    params.push(reason);
  }
  if (typeof is_removed === "boolean") {
    where.push(`is_removed = $${i++}`);
    params.push(is_removed);
  }
  if (typeof is_banned === "boolean") {
    where.push(`is_banned = $${i++}`);
    params.push(is_banned);
  }
  if (reported_user_id) {
    where.push(`reported_user_id = $${i++}`);
    params.push(reported_user_id);
  }
  if (since) {
    where.push(`created_at >= $${i++}`);
    params.push(since);
  }
  if (until) {
    where.push(`created_at <= $${i++}`);
    params.push(until);
  }

  const sql = `
    SELECT report_id,
           public_code,
           source_page,
           followup_id,
           reported_user_id,
           reason,
           is_removed,
           is_banned,
           created_at,
           updated_at
      FROM reports
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
  ORDER BY created_at DESC
     LIMIT $${i++} OFFSET $${i++}
  `;
  params.push(Number(limit), Number(offset));

  const result = await query(sql, params);
  return result.rows;
}
