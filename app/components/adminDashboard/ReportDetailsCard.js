import Button from "../ui/Button"; // adjust path if needed

export default function ReportDetailsCard({
  report,
  onClose,
  onBan,
  onRemove,
}) {
  if (!report) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg text-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#E55B3C]">Report Details</h2>
      </div>

      {/* Report info */}
      <div className="mb-4 space-y-1 text-sm">
        <div>
          <span className="font-medium">Report ID:</span> {report.reportId}
        </div>
        <div>
          <span className="font-medium">Category:</span> {report.category}
        </div>
        <div>
          <span className="font-medium">Issue:</span> {report.issue}
        </div>
        <div>
          <span className="font-medium">Reporter:</span> {report.reporter}
        </div>
        <div>
          <span className="font-medium">Time:</span> {report.timeAgo}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          text="Ban User"
          onClick={() => {
            if (window.confirm("Sure to ban this user?")) {
              onBan?.(report);
            }
          }}
        />
        <Button
          text="Remove Report"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to remove this report?")
            ) {
              onRemove?.(report);
            }
          }}
        />{" "}
      </div>
    </div>
  );
}
