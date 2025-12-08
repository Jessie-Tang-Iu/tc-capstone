import { Download } from "lucide-react";
import LabelValue from "./InfoCard";

export default function ResumePreview({ title, app, resume }) {
  // console.log("Resume: ", resume);
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
    // console.log(`Download started for ${fileName} with type ${mineType}`);
  }

  return (
    <section className="space-y-3">
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">{title}</div>
              
        {(!resume?.error && !app.resume_data) && (
          <div className="p-4 grid gap-3">
            <LabelValue label="Summary" value={resume.summary} />
            <LabelValue label="Certificate" value={resume.certifications} />
            <LabelValue label="Skills" value={resume.skills} />
            <LabelValue label="Education" value={resume.education} />
            <LabelValue label="Experience" value={resume.experience} />
            <LabelValue label="Additional Information" value={resume.additional_info} />
          </div>
        )}
        {app.resume_data && (
          <div className="p-4 items-center gap-2 text-base text-black">
            <span className="inline-flex items-center justify-center px-2 py-1 mr-3 rounded bg-orange-100 text-[#E55B3C] text-sm font-bold">{app.resume_name.split('.').pop().toUpperCase()}</span>
            <span className="font-bold truncate">{app.resume_name}</span>
            <div className="mt-3">
              <div className="text-base text-black">
                {"We can't load a preview of your resume right now, but it will be submitted as part of your application. Download your resume to make sure everything is correct before you submit your application."}
              </div>
              <button
                onClick={() => downloadFile(app.resume_data, app.resume_name)}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#E55B3C]/80 text-white text-sm font-bold hover:bg-[#E55B3C]/90 transition-colors"
              >
                <Download className="w-4 h-4" /> Download Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}