"use client";

import React from "react";

export default function CourseContent({ lessons, openLesson }) {

  const handleCompletion = async () => {
    
  }

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
      <button
        onClick={ handleCompletion() }
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Mark Complete
      </button>
    </div>
  );
}
