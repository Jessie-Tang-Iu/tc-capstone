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

export default function AppDetail({app, resume, coverLetter, onDownload}) {

  // console.log("Resume: ", resume);
  // console.log("Cover letter: ", coverLetter);
  // console.log("App: ", app);

  if (!app) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-gray-600 text-lg">Select a application to view details</p>
      </div>
    );
  }

  const appliedDate = app.applied_at
    ? new Date(app.applied_at).toLocaleDateString()
    : null;

  const getMimeType = (fileName) => {
    if (!fileName) return 'application.octet-stream';

    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
  }

  const downloadFile = (fileObject, fileName = 'document') => {
    // File validation
    if (!fileObject || !fileObject.data || !Array.isArray(fileObject.data)) {
      console.log('Invalid file object structure for download.')
      return;
    }

    // Use byte array and get MIME type from fileName
    const bytes = fileObject.data;   
    const mineType = getMimeType(fileName);

    // Create Unit8Array and Blob
    const byteArray = new Uint8Array(bytes); 
    const blob = new Blob([byteArray], { type: mineType });

    // Trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`Download started for ${fileName} with type ${mineType}`);
  }

  // if (resumeBuffer) console.log("Resume Buffer: ", resumeBuffer);

  // const handleResumeDownload = () => {
  //   const fs = require('fs');
  //   const path = require('path');
  //   const resumeName = `${app.first_name + app.last_name}_resume.pdf`;
  //   fs.writeFileSync(path.join(__dirname, resumeName), resumeBuffer);
  //   console.log("Dir: ", path.join(__dirname, resumeName))
  // }

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
              <LabelValue label="First Name" value={app.first_name} />
              <LabelValue label="Last Name" value={app.last_name} />
              <LabelValue label="Email address" value={app.email} />
              <LabelValue label="Phone Number" value={app.phone || ""} />
            </div>
          </div>

          {/* Relative Information */}
          {(app.relative_first_name != "" || app.relative_last_name != "") && (
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="px-4 py-3 border-b border-gray-200 text-sm font-bold text-black">Relative Information</div>
            <div className="p-4 grid md:grid-cols-2 gap-3">
              <LabelValue label="First Name" value={app.relative_first_name} />
              <LabelValue label="Last Name" value={app.relative_last_name} />
              <LabelValue label="Email address" value={app.relative_email} />
              <LabelValue label="Phone Number" value={app.relative_phone} />
            </div>
          </div>
          )}
        </section>

        {/* Resume */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-bold text-black">Resume</h2>
          </div>
          {!app.resume_data ? (
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="px-4 py-3 border-b border-gray-200 text-sm font-bold text-black">TC Alberta Resume</div>
            <div className="p-4 grid gap-3">
              <LabelValue label="Summary" value={resume.summary} />
              <LabelValue label="Education" value={resume.education} />
              <LabelValue label="Certificate" value={resume.certifications} />
              <LabelValue label="Skills" value={resume.skills} />
              <LabelValue label="Experience" value={resume.experience} />
              <LabelValue label="Additional Information" value={resume.additional_info} />
            </div>
          </div>
          ) : (
          <div className="items-center gap-2 text-sm text-black">
            <span className="inline-flex items-center justify-center h-6 mr-3 rounded bg-orange-100 text-[#E55B3C] text-xs font-bold">{app.resume_name.split('.').pop().toUpperCase()}</span>
            <span className="font-bold truncate">{app.resume_name}</span>
            <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-3">
              <div className="text-sm text-[#E55B3C]">
                {"We can't load a preview of your resume right now, but it will be submitted as part of your application. Download your resume to make sure everything is correct before you submit your application."}
              </div>
              {app.resume_data && (
                <button
                  onClick={() => downloadFile(app.resume_data, app.resume_name)}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#E55B3C]/80 text-white text-xs font-bold hover:bg-[#E55B3C]/90 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </button>
              )}
            </div>
          </div>
          )}
        </section>

        {/* Cover Letter */}
        <section className="space-y-3">
          <h2 className="text-base md:text-lg font-bold text-black">Cover letter</h2>
          {!app.cover_letter_name ? (
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="px-4 py-3 border-b border-gray-200 text-sm font-bold text-black">TC Alberta Cover Letter</div>
              <div className="px-5 pt-5 pb-2 text-sm text-black break-words">
                {coverLetter.content.split('\\n').map((line, idx) => ( <p key={idx} className="mb-3">{line}</p> ))}
              </div>
          </div>
          ) : (
          <div className="items-center gap-2 text-sm text-black">
            <span className="inline-flex items-center justify-center h-6 mr-3 rounded bg-orange-100 text-[#E55B3C] text-xs font-bold">{app.cover_letter_name.split('.').pop().toUpperCase()}</span>
            <span className="font-bold truncate">{app.cover_letter_name}</span>
            <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-3">
              <div className="text-sm text-[#E55B3C]">
                {"We can't load a preview of your resume right now, but it will be submitted as part of your application. Download your resume to make sure everything is correct before you submit your application."}
              </div>
              {app.cover_letter_name && (
                <button
                  onClick={onDownload}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#E55B3C]/80 text-white text-xs font-bold hover:bg-[#E55B3C]/90 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Cover Letter
                </button>
              )}
            </div>
          </div>
          )}
        </section>

        {/* Employer questions */}
        <section className="space-y-3">
          <h2 className="text-base md:text-lg font-bold text-black">Employer questions</h2>
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="p-4">
              {app.questions.length > 0 ? (
                app.questions.map((qa, idx) => (
                  
                  <QAItem key={idx} q={qa} a={app.answers[idx]} />
                ))
              ) : (
                <div className="text-sm text-gray-600">No questions provided.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
