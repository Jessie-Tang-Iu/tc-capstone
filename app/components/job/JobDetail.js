import { ExternalLink, Bookmark, Link as LinkIcon } from "lucide-react";

export default function JobDetail({ job, onApply }) {
  if (!job) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
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

  const renderHTML = (content) => ({
    __html: content || "<p>No information provided.</p>",
  });

  return (
    <div className="bg-white h-full overflow-y-auto">
      {/* Job Header */}
      <div className="border-b border-gray-400 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-lg md:text-xl font-bold text-black mb-2">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm md:text-base font-normal text-gray-600">
                {job.company}
              </span>
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </div>

            <p className="text-sm md:text-base font-normal text-black">
              {job.location} · {job.salary_per_hour} · {job.type} ·{" "}
              {job.workplace} · {normalizeDate(job.posted_at)}
            </p>
          </div>

          <div className="flex gap-2 lg:flex-row lg:items-center">
            <button
              className="bg-[#E55B3C] text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-normal hover:bg-[#E55B3C]/90 transition-colors"
              onClick={onApply}
            >
              Apply Now
            </button>
            <div className="flex gap-2">
              <button className="bg-[#E55B3C] text-white p-2 rounded-lg hover:bg-[#E55B3C]/90 transition-colors">
                <Bookmark className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E55B3C] text-white p-2 rounded-lg hover:bg-[#E55B3C]/90 transition-colors"
              >
                <LinkIcon className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* About the company */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
            About the company
          </h2>
          <div
            className="text-sm text-black leading-relaxed"
            dangerouslySetInnerHTML={renderHTML(job.company_info)}
          />
        </section>

        {/* About the job */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
            About the job
          </h2>
          <div
            className="text-sm text-black leading-relaxed"
            dangerouslySetInnerHTML={renderHTML(job.description)}
          />
        </section>

        {/* Responsibilities */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
            What you bring to the team
          </h2>
          <div
            className="text-sm text-black leading-relaxed"
            dangerouslySetInnerHTML={renderHTML(job.responsibilities)}
          />
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
            What skills you need
          </h2>
          <div
            className="text-sm text-black leading-relaxed"
            dangerouslySetInnerHTML={renderHTML(job.requirements)}
          />
        </section>

        {/* More details */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
            More details
          </h2>
          <div
            className="text-sm text-black leading-relaxed"
            dangerouslySetInnerHTML={renderHTML(job.details)}
          />
        </section>

        {/* Benefits */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
            Benefits
          </h2>
          <div
            className="text-sm text-black leading-relaxed"
            dangerouslySetInnerHTML={renderHTML(job.benefits)}
          />
        </section>
      </div>
    </div>
  );
}
