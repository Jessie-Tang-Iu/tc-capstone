import { ExternalLink, Download } from "lucide-react";
import { useState } from "react";
import LabelValue from "./InfoCard";
import ContactPreview from "./ContactPreview";
import RelativePreview from "./RelativePreview";
import ResumePreview from "./ResumePreview";
import CoverLetterPreview from "./CoverLetterPreview";
import AnswerPreview from "./AnswerPreview";

const statusColors = {
    "S": "bg-gray-100 text-gray-800 border-gray-300",
    "U": "bg-blue-100 text-blue-800 border-blue-300",
    "I": "bg-green-100 text-green-800 border-green-300",
    "R": "bg-red-100 text-red-800 border-red-300",
    "O": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "D": "bg-orange-100 text-orange-800 border-orange-300",
};

const statusOptions = {
    "S": "Submitted",
    "U": "Under review",
    "I": "Interview scheduled",
    "R": "Rejected",
    "O": "Offer",
    "D": "Withdrawn",
};

export default function AppDetail({app, resume, coverLetter, onDownload}) {

  // console.log("Resume detail: ", resume);
  // console.log("Cover letter: ", coverLetter);
  // console.log("App: ", app);

  if (!app) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-gray-600 text-base">Select a application to view details</p>
      </div>
    );
  }

  const appliedDate = app.applied_at
    ? new Date(app.applied_at).toLocaleDateString()
    : null;

  return (
    <div className="bg-white h-full rounded-xl overflow-y-auto mr-2">
      {/* Header */}
      <div className="border-b border-gray-300 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2">
            <h1 className="flex-3 text-lg font-bold text-black leading-tight">{app.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm border ${statusColors[app.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                {statusOptions[app.status]}
            </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base text-gray-700">{app.company}</span>
          <ExternalLink className="w-4 h-4 text-gray-600" />
        </div>
        <div className="text-base text-black mt-1">
          {app.location}
          {appliedDate ? ` · Applied on ${appliedDate}` : ""}

        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Application details */}
        <section className="space-y-3">

          {/* Contact Information */}
          <ContactPreview title="Contact Information" app={app} />

          {/* Relative Information */}
          {(app.relative_first_name != "" || app.relative_last_name != "") && (
            <RelativePreview title="Relative Information" app={app} />
          )}
        </section>

        {/* Resume */}
        <ResumePreview title="Resume" app={app} resume={resume} />

        {/* Cover Letter */}
        <CoverLetterPreview title="Cover Letter" app={app} coverLetter={coverLetter} />
        

        {/* Employer questions */}
        <AnswerPreview title="Employer questions" app={app} />
      </div>
    </div>
  );
};
