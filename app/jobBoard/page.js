"use client";

import { useUserContext } from "@/app/context/userContext";
import React, { useEffect, useState } from "react";
import MemberNavbar from "../components/MemberNavBar";
import SearchBar from "../components/job/SearchBar";
import JobCard from "../components/job/JobCard";
import JobDetail from "../components/job/JobDetail";
import AdvancedSearch from "../components/job/AdvancedSearch";
import ApplyForm from "../components/application/ApplyForm";

export default function JobBoardPage() {

    const { user, getCurrentSession } = useUserContext();

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState();
    
    const [showJobDetail, setShowJobDetail] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);

    const [filteredJobs, setFilteredJobs] = useState([]);
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
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

    const [formData, setFormData] = useState({
      id: null,
      job_id: null,
      user_id: null,
      resume: null,
      cover_letter: null,
      relative_first_name: "",
      relative_last_name: "",
      relative_email: "",
      relative_phone: "",
      answers: [],
    });

    const [currentStep, setCurrentStep] = useState(1); // For multi-step form
  
    useEffect(() => {
      fetch('/api/job')
        .then((res) => res.json())
        .then((data) => {
          setJobs(data)}
        )
        .catch((error) => console.error('Error fetching jobs:', error));
    }, []);

    useEffect(() => {
      setFilteredJobs(jobs);
    }, [jobs]);

    useEffect(() => {
      search();
    }, [filters]);

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

    const handleApply = () => {
      // reset ApplyForm
      setFormData({
        id: Math.floor(10000 + Math.random() * 90000),
        job_id: selectedJobId,
        user_id: user.id,
        resume: null,
        cover_letter: null,
        relative_first_name: "",
        relative_last_name: "",
        relative_email: "",
        relative_phone: "",
        answers: Array(selectedJob?.questions?.length || 0).fill(""),
      });
      console.log("Form Data Reset:", formData);
      setShowApplyForm(true);
    }

    const handleApplySubmit = async () => {
      console.log(formData);
      try{
        const res = await fetch(`/api/application/user/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to submit application");
        setFormData({
          id: null,
          job_id: null,
          user_id: null,
          resume: null,
          cover_letter: null,
          relative_first_name: "",
          relative_last_name: "",
          relative_email: "",
          relative_phone: "",
          answers: [],
        });
        setCurrentStep(5);
      } catch (e) {
        console.error(e);
      }
    }
  
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

    if (!user) {
      try {
        getCurrentSession();
        
      } catch (error) {
        console.error("Error fetching session:", error);
        alert("Error", "Failed to fetch session. Please sign in again.");
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }
  
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
            onLocationChange={setLocation}
            onSearch={search}
            onAdvancedSearch={() => setShowAdvancedSearch(true)}
          />
        </div>
  
        {showAdvancedSearch && (
          <AdvancedSearch 
            filters={filters} 
            setFilters={setFilters} 
            onClose={() => setShowAdvancedSearch(false)} 
          k/>
        )}
  
        {showApplyForm && (user.role == 'member') && (
          <ApplyForm 
            job={selectedJob} 
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onSubmit={handleApplySubmit}
            onClose={() => {setShowApplyForm(false); setCurrentStep(1);}} 
          />
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
                  onApply={handleApply}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    );
    }
