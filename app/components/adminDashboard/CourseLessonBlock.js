"use client";

import React from "react";

export default function CourseLessonBlock({ lesson, onChange, onDelete }) {
  const handleChange = (field, value) => {
    onChange({ ...lesson, [field]: value });
  };

  return (
    <div className="border-2 border-[#E55B3C] bg-[#fdf6f4] rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[#E55B3C] text-lg">
          Lesson
        </h3>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>

      {/* Lesson Title */}
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">Lesson Title</label>
        <input
          type="text"
          value={lesson.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter lesson title"
          className="w-full border border-gray-300 rounded p-2 text-black"
        />
      </div>

      {/* Lesson Description / Content */}
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">
          Lesson Content
        </label>
        <textarea
          value={lesson.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Write or paste lesson content"
          className="w-full border border-gray-300 rounded p-2 text-black min-h-[100px]"
        />
      </div>

      {/* Video URL */}
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">
          Video URL
        </label>
        <input
          type="url"
          value={lesson.videoUrl || ""}
          onChange={(e) => handleChange("videoUrl", e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="w-full border border-gray-300 rounded p-2 text-black"
        />
      </div>
    </div>
  );
}

