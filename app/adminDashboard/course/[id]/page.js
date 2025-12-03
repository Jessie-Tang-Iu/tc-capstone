"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/BlankNavBar";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/course/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
        setLessons(data.lessons || []);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setLevel(data.level || "");
        setDuration(data.duration || "");
        setType(data.type || "");
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedCourse = { title, description, level, duration, type };
    try {
      const res = await fetch(`/api/course/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse),
      });
      if (!res.ok) throw new Error("Failed to update course");
      alert("Course updated successfully");
      router.push("/admin"); // go back to dashboard
    } catch (err) {
      console.error(err);
      alert("Error updating course");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/course/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");
      alert("Course deleted");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    }
  };

  if (loading) return <div className="p-6 text-black">Loading course...</div>;
  if (!course) return <div className="p-6 text-black">Course not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen text-black">
        <Navbar />
        <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-[#E55B3C] mb-4">Edit Course</h1>

            <form onSubmit={handleUpdate} className="space-y-4">
            <div>
                <label className="block font-semibold mb-1 text-gray-700">Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block font-semibold mb-1 text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block font-semibold mb-1 text-gray-700">Level</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                    >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div className="flex-1">
                        <label className="block font-semibold mb-1 text-gray-700">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                        >
                            <option value="">Select type</option>
                            <option value="Online">Online</option>
                            <option value="In Person">In Person</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Duration</label>
                    <input
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Delete Course
                    </button>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/adminDashboard")}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#E55B3C] text-white px-4 py-2 rounded hover:bg-[#c94b2d]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>

        {lessons.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-[#E55B3C]">Lessons</h2>
            <ul className="divide-y">
              {lessons.map((l, i) => (
                <li key={l.id} className="py-2 text-gray-700">
                  {i + 1}. {l.title} <span className="text-sm text-gray-500">({l.type})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
