"use client";

import React from "react";

export default function CourseContent({ lessons, openLesson, userId }) {
  const handleCompletion = async (lessonId) => {
    try {
      const res = await fetch("/api/course/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lessonId }),
      });

      if (!res.ok) throw new Error("Failed to mark lesson complete");
      const data = await res.json();
      console.log("Lesson completion saved:", data);
      alert("Lesson marked as complete.");
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
      <ul className="divide-y">
        {lessons.map((l, i) => (
          <li
            key={l.id}
            className="py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-md flex justify-between items-center"
          >
            <div onClick={() => openLesson(i)}>
              <span className="font-medium">
                {l.type === "quiz" ? "📝 Quiz" : "📖 Lesson"} {i + 1}:
              </span>{" "}
              {l.title}
            </div>
            {l.completed ? (
              <span className="text-green-600 font-semibold text-sm">✓ Done</span>
            ) : (
              <button
                onClick={() => handleCompletion(l.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                Mark Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
