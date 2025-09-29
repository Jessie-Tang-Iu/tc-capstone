import * as reports from "../database/scripts/reports.js";

/** Get all reports (supports optional limit/offset) */
export async function getAllReportsController(params = {}) {
  return await reports.getAllReports(params);
}

/** Get a single report by internal id */
export async function getReportByIdController(id) {
  if (!id) throw new Error("id is required");
  return await reports.getReportById(id);
}

/** Get a report by public 8-digit code */
export async function getReportByPublicCodeController(publicCode) {
  if (!publicCode) throw new Error("publicCode is required");
  return await reports.getReportByPublicCode(publicCode);
}

/** Create a new report */
export async function createReportController(payload) {
  // Minimal validation; keep thin
  const required = ["source_page", "reported_user_id", "reason"];
  const missing = required.filter((k) => !payload?.[k]);
  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
  return await reports.createReport(payload);
}

/** Partial update of a report’s non-boolean fields */
export async function updateReportByIdController(id, patch) {
  if (!id) throw new Error("id is required");
  return await reports.updateReportById(id, patch);
}

/** Mark/unmark a report as removed */
export async function markReportRemovedController(id, isRemoved = true) {
  if (!id) throw new Error("id is required");
  return await reports.markReportRemoved(id, Boolean(isRemoved));
}

/** Mark/unmark the reported user as banned (flag on this row) */
export async function markReportedBannedController(id, isBanned = true) {
  if (!id) throw new Error("id is required");
  return await reports.markReportedBanned(id, Boolean(isBanned));
}

/** Hard delete a report by id */
export async function deleteReportByIdController(id) {
  if (!id) throw new Error("id is required");
  await reports.deleteReportById(id);
  return { ok: true };
}

/** Find reports by filters */
export async function findReportsController(filters = {}) {
  return await reports.findReports(filters);
}
