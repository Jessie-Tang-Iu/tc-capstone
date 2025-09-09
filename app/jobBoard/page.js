"use client";

import { useState } from "react";
import MemberNavbar from "../components/MemberNavBar";
import Navbar from "../components/NavBar";
import SearchBar from "../components/job/SearchBar";
import sampleJobs from "../data/jobs.json";
import JobCard from "../components/job/JobCard";
import JobDetail from "../components/job/JobDetail";
import AdvancedSearch from "../components/job/AdvancedSearch";
import ApplyForm from "../components/application/ApplyForm";
import { useUserContext } from "../context/userContext";

export default function JobBoardPage() {

    const { role } = useUserContext();

    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);

    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");
    const [workplace, setWorkplace] = useState("");

    const [selectedJobId, setSelectedJobId] = useState();
    const [showJobDetail, setShowJobDetail] = useState(false);
    const selectedJob = sampleJobs.find(job => job.id === selectedJobId);

    const handleJobSelect = (jobId) => {
        setSelectedJobId(jobId);
        setShowJobDetail(true);
    };

    const handleBackToList = () => {
        setShowJobDetail(false);
    };

    return (
        <main className="bg-gray-100 min-h-screen">
            {/* Navigation */}
            {role == "member" ? <MemberNavbar /> : <Navbar />}

            {/* Search Bar */}
            <div className="py-5">
                <SearchBar
                    query={query} onQueryChange={setQuery}
                    location={location} onLocationChange={setLocation}
                    experience={experience} onExperienceChange={setExperience}
                    workplace={workplace} onWorkplaceChange={setWorkplace}
                    onAdvancedSearch={() => setShowAdvancedSearch(true)}
                />
            </div>

            {showAdvancedSearch && 
                <AdvancedSearch onClose={() => setShowAdvancedSearch(false)} />
            }

            {showApplyForm && 
                <ApplyForm job={selectedJob} onClose={() => setShowApplyForm(false)} />
            }

            {/* Main Content */}
            <div className="flex flex-col md:flex-row">
                {/* Job Listings Sidebar */}
                <div 
                    className={`w-full md:w-96 lg:w-[400px] xl:w-[450px]
                    ${showJobDetail ? 'hidden md:block' : 'block'}
                    h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto`}
                >
                    <div className="px-2 md:px-4 py-2">
                        {sampleJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                title={job.title}
                                company={job.company}
                                location={job.location}
                                tags={[job.salary, job.type, job.workplace, job.experience]}
                                isSelected={job.id === selectedJobId}
                                onClick={() => handleJobSelect(job.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Job Detail Panel */}
                <div 
                    className={`flex-1 py-2
                                ${showJobDetail ? 'block' : 'hidden md:block'}
                                h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] relative`}
                >
                    {/* Mobile Back Button */}
                    <button
                        onClick={handleBackToList}
                        className="md:hidden top-4 ml-5 z-10 text-black rounded-lg text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors"
                    >
                        ← Back to Jobs
                    </button>
                    <div className="mt-5 md:mt-0 h-full">
                        <JobDetail job={selectedJob} onApply={() => setShowApplyForm(true)} />
                    </div>
                </div>
            </div>
        </main>
    );
}