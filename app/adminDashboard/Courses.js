"use client";
import React, { useState, useEffect } from "react";
import AdminCourse from "../components/adminDashboard/AdminCourse";
import AdminCourseCreate from "../components/adminDashboard/AdminCourseCreate";
import AdminCourseEdit from "../components/adminDashboard/AdminCourseEdit";
import AdminCourseOverview from "../components/adminDashboard/AdminCourseOverview";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list, edit, create, overview
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;

    if (searchText) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterLevel) {
      result = result.filter((c) => c.level === filterLevel);
    }

    if (filterType) {
      result = result.filter((c) => c.type === filterType);
    }

    setFilteredCourses(result);
  }, [searchText, filterLevel, filterType, courses]);

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

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    setView("overview");
  };

  if (loading) return <div className="p-6 text-black">Loading...</div>;

  return (
    <main>
      {view === "list" && (
        <>
          <div className="mb-6 rounded-xl bg-white p-6 shadow">
            <div className="mb-4 text-3xl font-semibold text-[#E55B3C] text-center">
              Courses Management
            </div>

            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div className="flex justify-center gap-3">
              {/* Search by name */}
              <input
                type="text"
                placeholder="Search by name..."
                className="h-10 border-2 px-3 py-2 rounded w-1/3 bg-[#f8f1ed] border-[#E55B3C] text-black"
                onChange={(e) => {
                  const text = e.target.value.toLowerCase();
                  setFilteredCourses(
                    courses.filter((c) =>
                      c.title.toLowerCase().includes(text)
                    )
                  );
                }}
              />
              {/* Filter by Level */}
              <select
                className="h-10 border-2 px-3 py-2 rounded bg-[#f8f1ed] border-[#E55B3C] text-black"
                onChange={(e) => {
                  const level = e.target.value;
                  setFilteredCourses(
                    level === ""
                      ? courses
                      : courses.filter((c) => c.level === level)
                  );
                }}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Filter by Type */}
              <select
                className="h-10 border-2 px-3 py-2 rounded bg-[#f8eae2]white border-[#E55B3C] text-black"
                onChange={(e) => {
                  const type = e.target.value;
                  setFilteredCourses(
                    type === ""
                      ? courses
                      : courses.filter((c) => c.type === type)
                  );
                }}
              >
                <option value="">All Types</option>
                <option value="Online">Online</option>
                <option value="In Person">In Person</option>
                <option value="Workshop">Workshop</option>
              </select>
              </div>
              <button
                onClick={() => setView("create")}
                className="h-10 bg-[#E55B3C] text-white px-4 py-2 rounded-lg hover:bg-[#c94b2d]"
              >
                Create Course
              </button>
            </div>
          </div>

          <div className="w-full">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.id || course._id}
                  onClick={() => handleCourseClick(course.id)}
                  className="cursor-pointer"
                >
                  <AdminCourse course={course} />
                </div>
              ))
            ) : (
              <p className="text-gray-600 p-4">No courses found.</p>
            )}
          </div>
        </>
      )}

      {view === "create" && (
        <AdminCourseCreate
          onCancel={() => setView("list")}
          onRefresh={fetchCourses}
        />
      )}
      
      {view === "overview" && selectedCourseId && (
        <AdminCourseOverview
          courseId={selectedCourseId}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
        />
      )}

      {view === "edit" && selectedCourseId && (
        <AdminCourseEdit
          courseId={selectedCourseId}
          onCancel={() => setView("overview")}
          onRefresh={fetchCourses}
        />
      )}
    </main>
  );
}
