"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

export default function CourseContent({ lesson }) {
  const { user } = useUser();
  const userId = user?.id; // Clerk user ID used for saving progress

  if (!lesson) return null;

  const handleCompletion = async () => {
    try {
      const res = await fetch("/api/course/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lessonId: lesson.id }),
      });
      if (!res.ok) throw new Error("Failed to mark lesson complete");
      const data = await res.json();
      console.log("Lesson completion saved:", data);
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
      <div
        className="text-gray-700 mb-4"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      {lesson.video_url && (
        <iframe
          className="rounded-lg w-full h-64"
          src={lesson.video_url}
          title={lesson.title}
          allowFullScreen
        ></iframe>
      )}
      <button
        onClick={handleCompletion}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
      >
        Mark Complete
      </button>
    </div>
  );
}
