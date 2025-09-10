"use client";

import React from "react";
import { useState } from "react";

import courses from "../../data/courses.json";
import courseContent from "../../data/courseData.json";
import Navbar from "../../components/MemberNavBar";

export default function CoursePage({ params }) {
  const { courseID } = React.use(params);

  const id = Number(courseID);
  const course = courses.find((c) => c.courseID === id);
  const content = courseContent[id]?.lessons || [];

  const [selectedLesson, setSelectedLesson] = useState(null);

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  const lesson = selectedLesson !== null ? content[selectedLesson] : null;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/6 border-r border-black min-h-screen text-black my-5">
          {content.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`p-4 cursor-pointer ${
                selectedLesson === index ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => setSelectedLesson(index)}
            >
              <span className="font-semibold">{index + 1}.</span>{" "}
              {lesson.type === "quiz" ? "Quiz" : "Lesson"} - {lesson.title}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {lesson ? (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">{lesson.title}</h2>

              {lesson.type === "lesson" && (
                <>
                  <p className="text-gray-700 mb-4">{lesson.content}</p>
                  {lesson.video && (
                    <iframe
                      className="rounded-lg"
                      width="560"
                      height="315"
                      src={lesson.video}
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </>
              )}

              {lesson.type === "quiz" && (
                <div>
                  {lesson.questions.map((q, i) => (
                    <div key={i} className="mb-6">
                      <p className="font-medium text-black">{q.question}</p>
                      <ul className="ml-6 mt-2 list-disc text-black">
                        {q.answers.map((ans, j) => (
                          <li key={j}>{ans}</li>
                        ))}
                      </ul>
                      <p className="mt-1 text-sm text-green-600">
                        Correct Answer: {q.correctAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select a lesson or quiz from the left.</p>
          )}
        </div>
      </div>
    </div>
  );
}
