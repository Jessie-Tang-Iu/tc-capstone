"use client";
import React, { useState, useEffect } from "react";
import AdminCourse from "../components/adminDashboard/AdminCourse";
import AdminCourseCreate from "../components/adminDashboard/AdminCourseCreate";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");

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

  if (loading) return <div className="p-6 text-black">Loading...</div>;

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white p-6">
      {view === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#E55B3C]">
              Courses Dashboard
            </h1>
            <button
              onClick={() => setView("create")}
              className="bg-[#E55B3C] text-white px-4 py-2 rounded-lg hover:bg-[#c94b2d]"
            >
              Create Course
            </button>
          </div>

          <div className="w-full">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <AdminCourse key={course.id || course._id} course={course} />
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
        />
      )}
    </main>
  );
}
