"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/MemberNavBar";
import CourseCard from "../components/courseCard/courseCard.js";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PageContent() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
    certificateYes: false,
    certificateNo: false,
    online: false,
    inPerson: false,
    workshop: false,
  });

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Fetch all courses from API
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/course");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/signIn");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || loading) return <p>Loading...</p>;
  if (!isSignedIn || !user) return null;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const filterSearch = () => {
    let results = courses;

    const activeLevels = Object.entries(filters)
      .filter(([key, value]) => value && ["beginner", "intermediate", "advanced"].includes(key))
      .map(([key]) => key);

    const activeTypes = Object.entries(filters)
      .filter(([key, value]) => value && ["online", "inPerson", "workshop"].includes(key))
      .map(([key]) => key.toLowerCase());

    results = results.filter((course) => {
      const matchesLevel = activeLevels.length === 0 || activeLevels.includes(course.level?.toLowerCase());
      const matchesCertificate =
        (!filters.certificateYes && !filters.certificateNo) ||
        (filters.certificateYes && course.certificate === true) ||
        (filters.certificateNo && course.certificate === false);
      const matchesType =
        activeTypes.length === 0 ||
        (filters.online && course.type === "Online") ||
        (filters.inPerson && course.type === "In Person") ||
        (filters.workshop && course.type === "Workshop");
      return matchesLevel && matchesCertificate && matchesType;
    });

    if (searchQuery.trim() !== "") {
      results = results.filter((course) =>
        course.title.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredCourses(results);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />

      {/* Search Bar */}
      <header className="my-2 mx-2 rounded-xl bg-white p-6 shadow text-center">
        <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
          Courses
        </div>
        
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by Course Title or Tags"
            className="px-4 py-2 w-full max-w-200 border border-[#E55B3C] rounded-xl focus:outline-none placeholder-gray-700 text-black"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      {/* Filters and Courses */}
      <main className="flex flex-col md:flex-row mx-2">
        <div className="block w-full md:w-60 bg-white rounded text-black mt-0 md:mt-5 py-4">
          <div className="flex md:flex-col flex-row  mx-4 gap-4">
            <h2 className="hidden md:block min-w-22 font-bold text-xl">Filter By</h2>

            {/* LEVEL DROPDOWN */}
            <div className="w-full min-w-30">
              <label className="font-bold text-sm block mb-1 ">Course Level</label>
              <select
                className="w-full border p-2 rounded bg-[#f8f1ed] border-[#E55B3C] text-base text-black"
                value={filters.level || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, level: e.target.value }))
                }
              >
                <option value="">Any</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* CERTIFICATE DROPDOWN */}
            <div className="w-full min-w-30">
              <label className="font-bold text-sm block mb-1">Certificate</label>
              <select
                className="border p-2 rounded w-full bg-[#f8f1ed] border-[#E55B3C] text-black text-base"
                value={filters.certificate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, certificate: e.target.value }))
                }
              >
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* TYPE DROPDOWN */}
            <div className="w-full min-w-30">
              <label className="font-bold text-sm block mb-1">Course Type</label>
              <select
                className="border p-2 rounded w-full bg-[#f8f1ed] border-[#E55B3C] text-black text-base"
                value={filters.type || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="">Any</option>
                <option value="Online">Online</option>
                <option value="In Person">In Person</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-5/6 min-h-screen flex flex-wrap content-start">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} userId={user.id} />
            ))
          ) : (
            <p className="text-gray-600 p-4">No courses found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
