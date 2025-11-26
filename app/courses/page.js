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
    <div className="bg-gradient-to-br from-[#f8f1ed] to-white min-h-screen">
      <Navbar />

      {/* Search Bar */}
      <header className="flex justify-center mx-16">
        <div className="flex justify-between border border-black rounded-xl overflow-hidden p-2 my-4 w-1/4 h-15">
          <input
            type="text"
            placeholder="Search by Course Title or Tags"
            className="px-3 py-2 w-64 focus:outline-none placeholder-gray-700 text-black"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="bg-[#F26D51] text-white px-3 py-1 rounded-lg" onClick={filterSearch}>
            Search
          </button>
        </div>
      </header>

      {/* Filters and Courses */}
      <main className="flex">
        <div className="w-1/6 border-r-black border-r-1 min-h-screen text-black my-5">
          <div className="ml-8 mb-6">
            <h2 className="font-bold text-xl mb-4">Filter By</h2>

            {/* LEVEL DROPDOWN */}
            <div className="mb-4">
              <label className="font-medium text-lg block mb-1 ">Course Level</label>
              <select
                className="border p-2 rounded w-40 bg-[#f8f1ed] border-[#E55B3C] text-black"
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
            <div className="mb-4">
              <label className="font-medium text-lg block mb-1">Certificate</label>
              <select
                className="border p-2 rounded w-40 bg-[#f8f1ed] border-[#E55B3C] text-black"
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
            <div className="mb-4">
              <label className="font-medium text-lg block mb-1">Course Type</label>
              <select
                className="border p-2 rounded w-40 bg-[#f8f1ed] border-[#E55B3C] text-black"
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
