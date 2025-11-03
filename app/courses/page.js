"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Navbar from "../components/MemberNavBar";
import CourseCard from "../components/courseCard/courseCard.js";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import Button from "../components/ui/Button";

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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    type: "Online",
    certificate: false,
    level: "Beginner",
    lessonCount: 0,
    duration: "",
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
  if (!isSignedIn) return null;

  const handleAddCourse = () => {
    if (!newCourse.title.trim() || !newCourse.description.trim()) return;
    const nextCourse = {
      ...newCourse,
      courseID: filteredCourses.length + 1,
    };
    setFilteredCourses((prev) => [nextCourse, ...prev]);
    setNewCourse({
      title: "",
      description: "",
      type: "Online",
      certificate: false,
      level: "Beginner",
      lessonCount: 0,
      duration: "",
    });
    setShowCreateModal(false);
  };

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
    <div className="bg-gray-100 min-h-screen">
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

        <button
          className="ml-6 bg-[#E55B3C] text-white px-4 py-2 rounded-lg font-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          + New Course
        </button>
      </header>

      {/* Filters and Courses */}
      <main className="flex">
        <div className="w-1/6 border-r-black border-r-1 min-h-screen text-black my-5">
          <div className="ml-8 mb-4">
            <h2 className="font-bold text-xl">Filter By</h2>
            <h3 className="font-medium text-lg mt-2">Course Level</h3>
            {["beginner", "intermediate", "advanced"].map((lvl) => (
              <div key={lvl}>
                <input
                  type="checkbox"
                  id={lvl}
                  name={lvl}
                  checked={filters[lvl]}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={lvl}> {lvl.charAt(0).toUpperCase() + lvl.slice(1)}</label>
              </div>
            ))}
          </div>

          <div className="ml-8 mb-4">
            <h3 className="font-medium text-lg mt-2">Offers Certificate</h3>
            {["certificateYes", "certificateNo"].map((cert) => (
              <div key={cert}>
                <input
                  type="checkbox"
                  id={cert}
                  name={cert}
                  checked={filters[cert]}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={cert}> {cert === "certificateYes" ? "Yes" : "No"}</label>
              </div>
            ))}
          </div>

          <div className="ml-8 mb-4">
            <h3 className="font-medium text-lg mt-2">Type</h3>
            {["online", "inPerson", "workshop"].map((type) => (
              <div key={type}>
                <input
                  type="checkbox"
                  id={type}
                  name={type}
                  checked={filters[type]}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={type}> {type}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-5/6 min-h-screen flex flex-wrap content-start">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="text-gray-600 p-4">No courses found.</p>
          )}
        </div>
      </main>

      {/* Create Course Modal (local only, not backend) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto text-black">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h1 className="text-2xl font-bold text-[#E55B3C]">Create New Course</h1>
              <RxCross2
                onClick={() => setShowCreateModal(false)}
                className="cursor-pointer text-gray-600 hover:text-black"
                size={22}
              />
            </div>

            <div className="p-6 space-y-5">
              <input
                type="text"
                className="border border-gray-300 w-full px-3 py-2 rounded-lg"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
              <textarea
                className="border border-gray-300 w-full px-3 py-2 rounded-lg min-h-[5em]"
                placeholder="Course Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-4 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <Button onClick={handleAddCourse} text="Create" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
