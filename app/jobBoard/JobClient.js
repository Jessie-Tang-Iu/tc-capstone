"use client";

import { useEffect, useState } from "react";
import MemberNavbar from "../components/MemberNavBar";
import SearchBar from "../components/job/SearchBar";
import JobCard from "../components/job/JobCard";
import JobDetail from "../components/job/JobDetail";
import AdvancedSearch from "../components/job/AdvancedSearch";
import ApplyForm from "../components/application/ApplyForm";

export default function JobClient({ jobs = []}) {

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const [filters, setFilters] = useState({
    sortBy: "",
    datePosted: "",
    location: [],
    experience: [],
    workplace: [],
    type: [],
    industry: [],
    salary: "",
  });

  const [selectedJobId, setSelectedJobId] = useState();
  const [showJobDetail, setShowJobDetail] = useState(false);
  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setShowJobDetail(true);
    let job = jobs.find((job) => job.id === jobId);
    console.log("Selected Job:", job);
  };

  const handleBackToList = () => {
    setShowJobDetail(false);
  };

  const search = () => {
    setSelectedJobId();
    let results = jobs;

    results = results.filter((job) => {

      // Filter date
      let now = new Date();
      let posted = new Date(job.posted_at);
      let diffInMilliseconds = now.getTime() - posted.getTime();
      let diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
      const matchesDate = 
        filters.datePosted == "" ||
        filters.datePosted == "anytime" ||
        ((diffInDays < 1) && (filters.datePosted == "past24Hours")) ||
        ((diffInDays < 7) && (filters.datePosted == "pastWeek")) ||
        ((diffInDays < 31) && (filters.datePosted == "pastMonth"))
      

      // Filter location
      const matchesLocation = 
        filters.location.length === 0 || filters.location.includes(job.location);
      
      // Filter experience
      const matchesExperience = 
        filters.experience.length === 0 || filters.experience.includes(job.experience);
      
      // Filter Workplace
      const matchesWorkplace = 
        filters.workplace.length === 0 || filters.workplace.includes(job.workplace);

      // Filter type
      const matchesType = 
        filters.type.length === 0 || filters.type.includes(job.type);

      // Filter industry
      const matchesIndustry = 
        filters.industry.length === 0 || filters.industry.includes(job.industry);

      // Filter salary
      let minSalary = Number(filters.salary);
      const matchesSalary = 
        !minSalary || ((minSalary <= job.salary_per_hour) && (job.salary_per_hour <= (minSalary+5)));

      return matchesDate && matchesLocation && matchesExperience && matchesWorkplace && matchesType && matchesIndustry && matchesSalary;
    })

    if (query.trim() !== "") 
      results = results.filter((job) => job.title.toLowerCase().includes(query));
    
    if (location.trim() !== "")
      results = results.filter((job) => job.location.toLowerCase().includes(location));

    setFilteredJobs(results);
  }

  useEffect(() => {
    search();
  }, [filters])

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Navigation */}
      <MemberNavbar />

      {/* Search Bar */}
      <div className="py-5">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          location={location}
          onSearch={search}
          onLocationChange={setLocation}
          onAdvancedSearch={() => setShowAdvancedSearch(true)}
        />
      </div>

      {showAdvancedSearch && (
        <AdvancedSearch filters={filters} setFilters={setFilters} onClose={() => { setShowAdvancedSearch(false); }} />
      )}

      {showApplyForm && (
        <ApplyForm job={selectedJob} onClose={() => { setShowApplyForm(false); }} />
      )}

      {/* Main Content */}
      {filteredJobs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No jobs found.</div>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Job Listings Sidebar */}
          <div
            className={`w-full md:w-96 lg:w-[400px] xl:w-[450px]
                        ${showJobDetail ? "hidden md:block" : "block"}
                        h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto`}
          >
            <div className="px-2 md:px-4 py-2">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  tags={[`${job.salary_per_hour} per an hour`, job.type, job.workplace, job.experience, job.industry]}
                  isSelected={job.id === selectedJobId}
                  onClick={() => handleJobSelect(job.id)}
                />
              ))}
            </div>
          </div>

          {/* Job Detail Panel */}
          <div
            className={`flex-1 py-2
                        ${showJobDetail ? "block" : "hidden md:block"}
                        h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] relative`}
          >
            {/* Mobile Back Button */}
            <button
              onClick={handleBackToList}
              className="md:hidden top-4 ml-5 z-10 text-black text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors"
            >
              ← Back to Jobs
            </button>
            <div className="mt-5 md:mt-0 h-full rounded-lg">
              <JobDetail
                job={selectedJob}
                onApply={() => setShowApplyForm(true)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
