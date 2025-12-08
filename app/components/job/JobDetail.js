import { ExternalLink, Bookmark, Link as LinkIcon } from "lucide-react";

export default function JobDetail({ role, job, isApplied, onApply }) {
  if (!job) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl mr-2">
        <p className="text-gray-600 text-base">Select a job to view details</p>
      </div>
    );
  }

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
                  ${(isApplied || job.status != 'A')
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#E55B3C] hover:bg-[#E55B3C]/90'
                  }

                  text-white px-4 md:px-6 py-2 rounded-lg text-sm font-normal transition-colors
                `}
                onClick={onApply}
                disabled={isApplied || job.status != 'A'}
              >
                {job.status != 'A' ? 'Expired' : (isApplied ? 'Applied' : 'Apply Now')}
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
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">About the company</div>
          <div 
            dangerouslySetInnerHTML={{ __html: job.company_info }} 
            className="px-5 py-3 text-sm font-medium text-black break-words leading-relaxed"
          />
        </div>

        {/* About the job */}
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">About the job</div>
          <div 
            dangerouslySetInnerHTML={{ __html: job.description }} 
            className="px-5 py-3 text-sm font-medium text-black break-words leading-relaxed"
          />
        </div>

        {/* Responsibilities */}
        {job.responsibilities?.trim() &&
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">What you bring to the team</div>
          <div 
            dangerouslySetInnerHTML={{ __html: job.responsibilities }} 
            className="px-5 py-3 text-sm font-medium text-black break-words leading-relaxed"
          />
        </div>}

        {/* Requirements */}
        {job.requirements?.trim() &&
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">What skills you need</div>
          <div 
            dangerouslySetInnerHTML={{ __html: job.requirements }} 
            className="px-5 py-3 text-sm font-medium text-black break-words leading-relaxed"
          />
        </div>}

        {/* More details */}
        {job.details?.trim() &&
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">More details</div>
          <div 
            dangerouslySetInnerHTML={{ __html: job.details }} 
            className="px-5 py-3 text-sm font-medium text-black break-words leading-relaxed"
          />
        </div>}

        {/* Benefits */}
        {job.benefits?.trim() &&
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">Benefits</div>
          <div 
            dangerouslySetInnerHTML={{ __html: job.benefits }} 
            className="px-5 py-3 text-sm font-medium text-black break-words leading-relaxed"
          />
        </div>}
      </div>
    </div>
  );
}
