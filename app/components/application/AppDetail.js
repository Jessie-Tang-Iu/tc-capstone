import { ExternalLink, Download } from "lucide-react";
import { useState } from "react";

const statusColors = {
    "S": "bg-gray-100 text-gray-800 border-gray-300",
    "U": "bg-blue-100 text-blue-800 border-blue-300",
    "I": "bg-green-100 text-green-800 border-green-300",
    "R": "bg-red-100 text-red-800 border-red-300",
    "O": "bg-emerald-100 text-emerald-800 border-emerald-300",
    "D": "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const statusOptions = {
    "S": "Submitted",
    "U": "Under review",
    "I": "Interview scheduled",
    "R": "Rejected",
    "O": "Offer",
    "D": "Withdrawn",
};

const LabelValue = ({ label, value }) => (
  <div className="border border-gray-200 rounded-md p-3 bg-white">
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className="text-sm font-bold text-black break-words">{value || "—"}</div>
  </div>
);

const QAItem = ({ q, a }) => (
  <div className="border-b last:border-b-0 border-gray-200 py-3">
    <div className="text-xs text-gray-600 mb-1">{q}</div>
    <div className="text-sm font-bold text-black whitespace-pre-wrap break-words">{a || "—"}</div>
  </div>
);

export default function AppDetail(application, onDownload) {
  let app = null;
  if (!application.application) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-gray-600 text-lg">Select a application to view details</p>
      </div>
    );
  } else {
    // const app = application.application;
    app = application.application;
  };

  // if (!application.resume) {
  //   fetch(`/api/resume/user/${application.userid}`)
  // }

  const appliedDate = app.appliedAt
    ? new Date(app.applied_at).toLocaleDateString()
    : null;

  // const qs = [];
  // for (let i = 0; i < application.questions.length; i++) {
  //   let questionObj = {};
  //   questionObj.id = i+1;
  //   questionObj.question = application.questions[i];
  //   questionObj.answer = application.answers[i] || "No answer provided";
  //   qs.push(questionObj);
  // }
  // // setQuestions(qs);
  // console.log("Questions and answers:", qs);


  return (
    <div className="bg-white h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-300 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2">
            <h1 className="flex-3 text-lg md:text-xl font-bold text-black leading-tight">{app.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm border ${statusColors[app.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                {statusOptions[app.status]}
            </span>
        </div>
        {/* <h1 className="text-lg md:text-xl font-bold text-black leading-tight">{application.jobTitle}</h1> */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-700">{app.company}</span>
          <ExternalLink className="w-4 h-4 text-gray-600" />
        </div>
        <div className="text-sm text-black mt-1">
          {app.location}
          {appliedDate ? ` · Applied on ${appliedDate}` : ""}

        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Application details */}
        <section className="space-y-3">
          <h2 className="text-base md:text-lg font-bold text-black">Application details</h2>

          {/* Contact Information */}
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="px-4 py-3 border-b border-gray-200 text-sm font-bold text-black">Contact Information</div>
            <div className="p-4 grid md:grid-cols-2 gap-3">
              <LabelValue label="First Name" value={app.userfn} />
              <LabelValue label="Last Name" value={app.userln} />
              <LabelValue label="Email address" value={app.usere} />
              <LabelValue label="Phone Number" value={app.userp || ""} />
            </div>
          </div>

          {/* Relative Information */}
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="px-4 py-3 border-b border-gray-200 text-sm font-bold text-black">Relative Information</div>
            <div className="p-4 grid md:grid-cols-2 gap-3">
              <LabelValue label="First Name" value={app.relativefn} />
              <LabelValue label="Last Name" value={app.relativeln} />
              <LabelValue label="Email address" value={app.relativee} />
              <LabelValue label="Phone Number" value={app.relativep} />
            </div>
          </div>
        </section>

        {/* Resume */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-bold text-black">Resume</h2>
            {(app?.resume || onDownload) && (
              <button
                onClick={onDownload}
                className="text-sm text-[#E55B3C] hover:underline"
              >
                Download
              </button>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            {app.resume?.name ? (
              <div className="flex items-center gap-2 text-sm text-black">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-orange-100 text-[#E55B3C] text-xs font-bold">PDF</span>
                <span className="font-bold truncate">{app.resume.name}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No resume attached</div>
            )}

            <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-3">
              <div className="text-sm text-[#E55B3C]">
                {"We can't load a preview of your resume right now, but it will be submitted as part of your application. Download your resume to make sure everything is correct before you submit your application."}
              </div>
              {(app.resume?.url || onDownload) && (
                <button
                  onClick={onDownload}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#E55B3C]/80 text-white text-xs font-bold hover:bg-[#E55B3C]/90 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Employer questions */}
        {/* <section className="space-y-3">
          <h2 className="text-base md:text-lg font-bold text-black">Employer questions</h2>
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="p-4">
              {questions.length > 0 ? (
                questions.map((qa, idx) => (
                  <QAItem key={idx} q={qa.question} a={qa.answer} />
                ))
              ) : (
                <div className="text-sm text-gray-600">No questions provided.</div>
              )}
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};
