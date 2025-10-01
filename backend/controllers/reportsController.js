import * as reports from "../database/scripts/reports.js";

// Get all reports
export async function getReportsController() {
  return await reports.getAllReports();
}

// Get a single report by internal id
export async function getReportByIdController(id) {
  if (!id) throw new Error("Report ID is required");
  return await reports.getReportById(id);
}

// Get a report by public 8-digit code
export async function getReportByPublicCodeController(publicCode) {
  if (!publicCode) throw new Error("Public code is required");
  return await reports.getReportByPublicCode(publicCode);
}

// Create a new report
export async function createReportController(report) {
  if (!report.source_page || !report.reported_user_id || !report.reason) {
    throw new Error("Missing required report fields");
  }
  return await reports.createReport(
    report.source_page,
    report.followup_id,
    report.reported_user_id,
    report.reason,
    report.public_code
  );
}

// Update a report
export async function updateReportByIdController(id, patch) {
  if (!id) throw new Error("Report ID is required");
  return await reports.updateReportById(id, patch);
}

// Mark/unmark report as removed
export async function markReportRemovedController(id, isRemoved = true) {
  if (!id) throw new Error("Report ID is required");
  return await reports.markReportRemoved(id, isRemoved);
}

// Mark/unmark reported user as banned
export async function markReportedBannedController(id, isBanned = true) {
  if (!id) throw new Error("Report ID is required");
  return await reports.markReportedBanned(id, isBanned);
}

// Delete a report
export async function deleteReportByIdController(id) {
  if (!id) throw new Error("Report ID is required");
  return await reports.deleteReportById(id);
}
