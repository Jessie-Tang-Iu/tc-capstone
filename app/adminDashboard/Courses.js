"use client";

import React, { useState, useEffect } from "react";
import AdminCourse from "../components/adminDashboard/AdminCourse";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" or "create"

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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create course");
      alert("Course created successfully");
      setView("list");
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white p-6">
      {view === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#E55B3C]">Courses Dashboard</h1>
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
                <AdminCourse key={course.id} course={course} />
              ))
            ) : (
              <p className="text-gray-600 p-4">No courses found.</p>
            )}
          </div>
        </>
      )}

      {view === "create" && (
        <div className="bg-white rounded-lg shadow p-6 w-2/3 mx-auto">
          <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">
            Create New Course
          </h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <input
              name="title"
              placeholder="Course Title"
              required
              className="w-full border border-gray-300 rounded p-2 text-black"
            />
            <textarea
              name="description"
              placeholder="Course Description"
              required
              className="w-full border border-gray-300 rounded p-2 text-black"
            />
            <input
              name="level"
              placeholder="Course Level (e.g. Beginner)"
              className="w-full border border-gray-300 rounded p-2 text-black"
            />
            <input
              name="duration"
              placeholder="Duration (e.g. 2 Weeks / 7 Days)"
              className="w-full border border-gray-300 rounded p-2 text-black"
            />
            <input
              name="type"
              placeholder="Type (e.g. Online, In-Person, etc.)"
              className="w-full border border-gray-300 rounded p-2 text-black"
            />

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setView("list")}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-red-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#E55B3C] text-white px-4 py-2 rounded-lg hover:bg-[#c94b2d]"
              >
                Save Course
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
