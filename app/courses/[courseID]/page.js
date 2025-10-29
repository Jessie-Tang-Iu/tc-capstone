"use client";

import React, { useState } from "react";
import courses from "../../data/courses.json";
import courseContent from "../../data/courseData.json";
import Navbar from "../../../components/MemberNavBar";
import CourseContent from "../../components/CourseContent";
import CourseQuiz from "../../components/CourseQuiz";

export default function CoursePage({ params }) {
  const id = Number(params.courseID);
  const course = courses.find((c) => c.courseID === id);
  const lessons = courseContent[id]?.lessons || [];

  const [view, setView] = useState("home");
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (!course) return <div className="p-6 text-black">Course not found</div>;

  const openLesson = (index) => {
    setSelectedLesson(index);
    setView("lesson");
  };

  const lesson = selectedLesson !== null ? lessons[selectedLesson] : null;

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/5 border-r border-gray-300 min-h-screen bg-white">
          <div className="p-4 border-b font-semibold text-lg text-[#E55B3C]">
            {course.title}
          </div>
          <div
            className={`p-4 cursor-pointer ${view === "home" ? "bg-gray-200" : ""}`}
            onClick={() => setView("home")}
          >
            🏠 Course Home
          </div>
          <div
            className={`p-4 cursor-pointer ${view === "content" ? "bg-gray-200" : ""}`}
            onClick={() => setView("content")}
          >
            📘 Lessons & Quizzes
          </div>
          {lessons.map((l, i) => (
            <div
              key={l.id}
              className={`pl-8 pr-4 py-2 cursor-pointer ${
                selectedLesson === i && view === "lesson" ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => openLesson(i)}
            >
              {l.type === "quiz" ? "📝 Quiz" : "📖 Lesson"} {i + 1}: {l.title}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {view === "home" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="mb-4 text-gray-700">{course.description}</p>
              <div className="flex gap-6 mb-6 text-sm text-gray-600">
                <p>Level: {course.level}</p>
                <p>Type: {course.type}</p>
                <p>Lessons: {course.lessonCount}</p>
                <p>Duration: {course.duration}</p>
                {course.certificate && <p>🎓 Certificate Available</p>}
              </div>
              <button
                onClick={() => setView("content")}
                className="bg-[#E55B3C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c94b2d]"
              >
                View Course Content
              </button>
            </div>
          )}

          {view === "content" && (
            <CourseContent lessons={lessons} openLesson={openLesson} />
          )}

          {view === "lesson" && lesson && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>

              {lesson.type === "lesson" && (
                <>
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
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setView("content")}
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Back to Content
                    </button>
                    <button
                      onClick={() => setView("home")}
                      className="bg-[#E55B3C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c94b2d]"
                    >
                      Course Home
                    </button>
                  </div>
                </>
              )}

              {lesson.type === "quiz" && (
                <CourseQuiz
                  lesson={lesson}
                  backToContent={() => setView("content")}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
