"use client";

import { useState } from "react";
import Navbar from "../components/NavBar";
import SearchBar from "../components/job/SearchBar";
import sampleJobs from "../data/jobs.json";
import JobCard from "../components/job/JobCard";


export default function JobBoardPage() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");
    const [type, setType] = useState("");

    const [selectedJobId, setSelectedJobId] = useState(1);
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
            <Navbar />

            {/* Search Bar */}
            <div className="py-5">
                <SearchBar
                    query={query} onQueryChange={setQuery}
                    location={location} onLocationChange={setLocation}
                    experience={experience} onExperienceChange={setExperience}
                    type={type} onTypeChange={setType}
                />
            </div>

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
            </div>
        </main>
    );
}