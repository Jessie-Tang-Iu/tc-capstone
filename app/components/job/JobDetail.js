import { ExternalLink, Bookmark, Link as LinkIcon } from "lucide-react";

export default function JobDetail({ role, job, isApplied, onApply }) {
  if (!job) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl mr-2">
        <p className="text-gray-600 text-lg">Select a job to view details</p>
      </div>
    );
  }

  const normalizeDate = (d) => {
    if (!d) return null;
    if (typeof d === "string") return d.includes("T") ? d.split("T")[0] : d;
    if (d instanceof Date && !isNaN(d.getTime()))
      return d.toISOString().slice(0, 10);
    if (typeof d === "object" && typeof d.date === "string")
      return d.date.includes("T") ? d.date.split("T")[0] : d.date;
    return null;
  };

  return (
    <div className="bg-white h-full rounded-xl overflow-y-auto mr-2">
      {/* Job Header */}
      <div className="border-b border-gray-400 p-5">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-black mb-1">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-normal text-gray-600">
                {job.company}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </div>

            <p className="text-sm font-normal text-black">
              {job.location} · ${job.salary_per_hour} per hour · {job.type} ·{" "}
              {job.workplace} · Posted at {new Date(job.posted_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2 lg:flex-row lg:items-center">
            {role === "member" && (
              <button
                className={`
                  ${isApplied 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#E55B3C] hover:bg-[#E55B3C]/90'
                  } 
                  text-white px-4 md:px-6 py-2 rounded-lg text-sm font-normal transition-colors
                `}
                onClick={onApply}
                disabled={isApplied}
              >
                {isApplied ? 'Applied' : 'Apply Now'}
              </button>
            )}
            <div className="flex gap-2">
              <button className="bg-[#E55B3C] text-white p-2 rounded-lg hover:bg-[#E55B3C]/90 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E55B3C] text-white p-2 rounded-lg hover:bg-[#E55B3C]/90 transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="p-5 space-y-6">
        {/* About the company */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black mb-1">About the company</h2>
          <p className="text-xs text-black">{job.company_info}</p>
        </section>

        {/* About the job */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black mb-1">About the job</h2>
          <p className="text-xs text-black">{job.description}</p>
        </section>

        {/* Responsibilities */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black mb-1">What you bring to the team</h2>
          <p className="text-xs text-black">{job.responsibilities}</p>
        </section>

        {/* Requirements */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black mb-1">What skills you need</h2>
          <p className="text-xs text-black">{job.requirements}</p>
        </section>

        {/* More details */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black mb-1">More details</h2>
          <p className="text-xs text-black">{job.details}</p>
        </section>

        {/* Benefits */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black mb-1">Benefits</h2>
          <p className="text-xs text-black">{job.benefits}</p>
        </section>
      </div>
    </div>
  );
}
