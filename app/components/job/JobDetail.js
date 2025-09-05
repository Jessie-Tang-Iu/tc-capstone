import { ExternalLink, Bookmark, Link as LinkIcon } from "lucide-react";

export default function JobDetail({ job }) {
    if (!job) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <p className="text-gray-600 text-lg">Select a job to view details</p>
            </div>
        );
    }

    return (
        <div className="bg-white h-full overflow-y-auto">
            {/* Job Header */}
            <div className="border-b border-gray-400 p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-lg md:text-xl font-bold text-black mb-2">{job.title}</h1>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm md:text-base font-normal text-gray-600">{job.company}</span>
                            <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                        </div>
                        
                        <p className="text-sm md:text-base font-normal text-black">
                            {job.location} · {job.salary} · {job.type} · {job.workplace} · {job.datePosted}
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-row">
                        <button className="bg-primary text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-normal hover:bg-primary/90 transition-colors">
                            Apply Now
                        </button>
                        <div className="flex gap-2">
                            <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
                                <Bookmark className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
                                <LinkIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Content */}
            <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                {/* About the company */}
                <section>
                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">About the company</h2>
                    <p className="text-sm md:text-sm font-normal text-black leading-relaxed">
                        {job.aboutCompany}
                    </p>
                </section>

                {/* About the job */}
                <section>
                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">About the job</h2>
                    <p className="text-sm md:text-sm font-normal text-black leading-relaxed">
                        {job.aboutJob}
                    </p>
                </section>

                {/* What you bring to the team */}
                <section>
                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">What you bring to the team</h2>
                    <div className="text-sm md:text-sm font-normal text-black leading-relaxed whitespace-pre-line">
                        {job.responsibilities}
                    </div>
                </section>

                {/* What skill you need */}
                <section>
                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">What skill you need</h2>
                    <div className="text-sm md:text-sm font-normal text-black leading-relaxed whitespace-pre-line">
                        {job.requirements}
                    </div>
                </section>

                {/* More details */}
                <section>
                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">More details</h2>
                    <div className="text-sm md:text-sm font-normal text-black leading-relaxed whitespace-pre-line">
                        {job.moreDetails}
                    </div>
                </section>

                {/* Benefits */}
                <section>
                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">Benefits</h2>
                    <div className="text-sm md:text-sm font-normal text-black leading-relaxed whitespace-pre-line">
                        {job.benefits}
                    </div>
                </section>
            </div>
        </div>
    );
}