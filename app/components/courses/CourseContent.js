"use client";

import React from "react";

export default function CourseContent({ lessons, openLesson }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
      <ul className="divide-y">
        {lessons.map((l, i) => (
          <li
            key={l.id}
            className="py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-md"
            onClick={() => openLesson(i)}
          >
            <span className="font-medium">
              {l.type === "quiz" ? "📝 Quiz" : "📖 Lesson"} {i + 1}:
            </span>{" "}
            {l.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
