"use client";
import React, { useState } from "react";
import CourseLessonBlock from "./CourseLessonBlock";
import CourseQuizBlock from "./CourseQuizBlock";

export default function AdminCourseCreate({ onCancel, onRefresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("Online");
  const [contentBlocks, setContentBlocks] = useState([]);

  const addBlock = (blockType) => {
    const newBlock =
      blockType === "lesson"
        ? { id: Date.now(), type: "lesson", title: "", content: "", videoUrl: "" }
        : {
            id: Date.now(),
            type: "quiz",
            title: "New Quiz",
            description: "",
            questions: [
              {
                id: Date.now() + 1,
                question: "",
                answers: ["", "", "", ""],
                correct_answer: null,
              },
            ],
          };
    setContentBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (index, updatedBlock) => {
    const updated = [...contentBlocks];
    updated[index] = updatedBlock;
    setContentBlocks(updated);
  };

  const removeBlock = (id) => {
    setContentBlocks(contentBlocks.filter((b) => b.id !== id));
  };

  const isValidYouTubeUrl = (url) => {
    if (!url) return true; // empty URLs are allowed

     // Credit to https://stackoverflow.com/questions/19377262/regex-for-youtube-url for the Regex
    const regex =
      // This regex is used for checking if a inputted URL is from youtuve. 
      // In order this regex matches: Protocol (http, https) but isn't required, subdomains (www, m) some links may contain them so we need to check for them
      // Main Domain (youtube.com, youtu.be, youtube-nocookie.com) this just checks the possible domains of youtube links, paths (This just checks if it contains valid youtube paths)
      // Finally it checks the Video ID and extra parameters such as a start time.
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
    const match = url.match(regex);
    return match && match[5];
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();

    // Validate YouTube URLs before saving
    const invalidVideo = contentBlocks.find(
      (block) => block.type === "lesson" && block.videoUrl && !isValidYouTubeUrl(block.videoUrl)
    );
    if (invalidVideo) {
      alert(
        `The lesson "${invalidVideo.title || "Untitled"}" has an invalid YouTube URL.`
      );
      return; // stop saving
    }

    const courseData = { title, description, level, duration, type };

    const lessons = contentBlocks.map((block, index) => {
      if (block.type === "lesson") {
        return {
          type: "lesson",
          title: block.title,
          content: block.content || "",
          video_url: block.videoUrl || "",
          position: index + 1,
        };
      }

      if (block.type === "quiz") {
        return {
          type: "quiz",
          title: block.title,
          description: block.description,
          position: index + 1,
          questions: block.questions.map((q) => ({
            question: q.question,
            answers: q.answers,
            correct_answer: q.correct_answer,
          })),
        };
      }
    });

    const payload = { course: courseData, lessons };

    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create course");
      }

      alert("Course created successfully");
      onCancel();
      onRefresh();
    } catch (err) {
      console.error("Error creating course:", err);
      alert("Error creating course: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-4/5 mx-auto">
      <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Create New Course</h2>

      {/* Course Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Duration</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm text-black"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm text-black"
          >
            <option>Online</option>
            <option>In Person</option>
            <option>Workshop</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-sm text-black"
          rows={3}
        />
      </div>

      {/* Add Buttons */}
      <div className="flex justify-center gap-4 mt-6 mb-8">
        <button
          onClick={() => addBlock("lesson")}
          className="bg-[#E55B3C] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#c94b2d]"
        >
          + Add Lesson
        </button>
        <button
          onClick={() => addBlock("quiz")}
          className="bg-[#6C63FF] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#5951d8]"
        >
          + Add Quiz
        </button>
      </div>

      {/* Content Blocks */}
      <div className="space-y-6">
        {contentBlocks.map((block, index) =>
          block.type === "lesson" ? (
            <CourseLessonBlock
              key={block.id}
              index={index}
              lesson={block}
              onChange={(updated) => updateBlock(index, updated)}
              onRemove={() => removeBlock(block.id)}
            />
          ) : (
            <CourseQuizBlock
              key={block.id}
              index={index}
              quiz={block}
              onChange={(updated) => updateBlock(index, updated)}
              onRemove={() => removeBlock(block.id)}
            />
          )
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <button onClick={onCancel} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Cancel
        </button>
        <button
          onClick={handleSaveCourse}
          className="bg-[#E55B3C] text-white px-6 py-2 rounded-lg hover:bg-[#c94b2d]"
        >
          Save Course
        </button>
      </div>
    </div>
  );
}
