"use client";

import React, {useState} from "react";

export default function CourseLessonBlock({ lesson, onChange, onDelete }) {
  const [videoError, setVideoError] = useState("");
  const [displayUrl, setDisplayUrl] = useState(lesson.videoUrl || "");

  const extractVideoId = (url) => {
    // Regex to check if the URL is a youtube link (standard or shortened) and extract the video ID (Copied from StackOverflow user phuc77 https://stackoverflow.com/questions/19377262/regex-for-youtube-url) 
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
    // Example Valid URL: youtube.com/watch?v=jNQXAC9IVRw

    // Grabs Match group 5 which contains the video ID, that way we can add it to a premade embed URL when sending to the backend
    const match = url.match(regex);

    // If match and match[5] (video ID) exist, return the video ID, else return null
    return match && match[5] ? match[5] : null;
  };
  
  const formatYouTubeUrl = (url) => {
    if (!url) {
      setVideoError("");
      return "";
    }

    const id = extractVideoId(url);

    if (!id) {
      setVideoError("Please enter a valid YouTube URL");
      return null;
    }

    setVideoError("");
    return `https://www.youtube.com/embed/${id}`;
  };

  const handleChange = (field, value) => {
    if (field === "videoUrl") {
      setDisplayUrl(value); // show raw URL to user instead of the processed Embedded URL

      const embedUrl = formatYouTubeUrl(value);

      if (embedUrl === null) {
        onChange({ ...lesson, videoUrl: "" });
        return;
      }

      onChange({ ...lesson, videoUrl: embedUrl });
      return;
    }

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
          value={displayUrl}
          onChange={(e) => handleChange("videoUrl", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={`w-full border rounded p-2 text-black ${
            videoError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {videoError && (
          <p className="text-red-500 text-sm mt-1">{videoError}</p>
        )}
      </div>
    </div>
  );
}

