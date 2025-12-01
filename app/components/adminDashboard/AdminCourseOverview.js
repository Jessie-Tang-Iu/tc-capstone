"use client";
import React, { useEffect, useState } from "react";

export default function AdminCourseOverview({ courseId, onBack, onEdit }) {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetch(`/api/course/admin/${courseId}`);
        if (!res.ok) throw new Error("Failed to load course");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) return <div className="p-6 text-black">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow p-6 w-4/5 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-[#E55B3C]">
          Course Overview
        </h2>

        <button
          onClick={onBack}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-sm text-gray-700 font-semibold">Title</h3>
          <p className="text-black">{course.title}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-700 font-semibold">Level</h3>
          <p className="text-black">{course.level}</p>
        </div>

        <div>
          <h3 className="text-sm text-gray-700 font-semibold">Type</h3>
          <p className="text-black">{course.type}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-700 font-semibold">Duration</h3>
          <p className="text-black">{course.duration}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-sm text-gray-700 font-semibold mb-1">Description</h3>
        <p className="text-black whitespace-pre-wrap">{course.description}</p>
      </div>

      {/* Lessons Summary */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-[#E55B3C] mb-2">Course Content</h3>

        {course.lessons && course.lessons.length > 0 ? (
          <ul className="list-disc ml-6 text-black">
            {course.lessons.map((l, i) => (
              <li key={i}>
                {l.type === "lesson" ? "Lesson: " : "Quiz: "}
                {l.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No lessons added yet.</p>
        )}
      </div>

      {/* User Data Placeholder */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-[#E55B3C] mb-2">
          User Progress (Coming Soon)
        </h3>
        <div className="border border-gray-300 rounded-lg p-4 text-gray-500">
          User data integration will appear here.
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="bg-[#E55B3C] text-white px-6 py-2 rounded-lg hover:bg-[#c94b2d]"
        >
          Edit Course
        </button>
      </div>
    </div>
  );
}
