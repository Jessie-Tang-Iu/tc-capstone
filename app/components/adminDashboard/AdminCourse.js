"use client";
import React from "react";

export default function AdminCourse({ course }) {
  if (!course) return null;

  return (
    <div className="w-full bg-white rounded-lg shadow-md mb-4 p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-[#E55B3C]">{course.title}</h2>
          <p className="text-gray-700 mt-1 line-clamp-2">{course.description}</p>
        </div>
        <span className="text-sm text-gray-600 font-medium">
          {course.difficulty || course.level || "N/A"}
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-500 border-t border-gray-200 pt-2 flex flex-wrap gap-4">
        <p>Level: {course.level || "N/A"}</p>
        <p>Lessons: {course.lesson_count || 0}</p>
        <p>Duration: {course.duration || "N/A"}</p>
        <p>Type: {course.type || "N/A"}</p>
      </div>
    </div>
  );
}
