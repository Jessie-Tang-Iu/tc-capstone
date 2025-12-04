"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/MemberNavBar";
import CourseContent from "../../components/courses/CourseContent";
import CourseQuiz from "../../components/courses/CourseQuiz";

export default function CoursePage({}) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseID = params.courseID;
  const userId = searchParams.get("userId");

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseID) return;

    const fetchCourse = async () => {
      try {
        console.log(userId)
        const res = await fetch(`/api/course/${courseID}?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        console.log("Fetched course data:", data);
        setCourse(data);
        setLessons(data.lessons || []);
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseID]);

  useEffect(() => {
    if (lessons.length > 0) {
      const nextIndex = lessons.findIndex(l => !l.completed);
      setSelectedLessonIndex(nextIndex === -1 ? null : nextIndex);
    }
  }, [lessons]);

  const markLessonCompletedLocally = (lessonId) => {
    setLessons(prev => {
      const updated = prev.map(l =>
        l.id === lessonId ? { ...l, completed: true } : l
      );

      for (let i = 0; i < updated.length; i++) {
        if (updated[i].completed) continue;
        updated[i].locked = false;
        break;
      }

      return [...updated];
    });
  };

  if (loading) return <div className="p-6 text-black bg-white">Loading course...</div>;
  if (!course) return <div className="p-6 text-black bg-white">Course not found</div>;

  const selectedLesson = selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  if (selectedLesson && selectedLesson.locked) {
    return (
      <div className="flex-1 p-6 ml-[20%]">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-700">
            This lesson is locked. Complete earlier lessons to unlock it.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <Navbar />

      <div className="flex">
        {/* Sidebar with lessons */}
        <div className="fixed left-0 top-0 w-1/5 h-screen border-r border-gray-300 bg-white overflow-y-auto">
          <div className="p-4 border-b font-semibold text-lg text-[#E55B3C]">
            {course.title}
          </div>

          <div
            className="p-4 cursor-pointer text-blue-600 hover:underline"
            onClick={() => router.push("/courses")}
          >
            ← Back to Courses
          </div>

          <div className="p-4 cursor-pointer" onClick={() => setSelectedLessonIndex(null)}>
            Course Home
          </div>
          <div className="p-4 cursor-pointer font-semibold">Lessons & Quizzes</div>

          {lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className={`pl-8 pr-4 py-2 flex items-center cursor-pointer ${
                lesson.locked ? "opacity-50 cursor-not-allowed" : ""
              } ${selectedLessonIndex === i ? "bg-gray-200" : ""}`}
              onClick={() => {
                if (lesson.locked) return;
                setSelectedLessonIndex(i);
              }}
            >
              <span className={`flex-1 ${lesson.completed ? "text-green-600" : ""}`}>
                {lesson.type === "quiz" ? "Quiz" : "Lesson"} {i + 1}: {lesson.title}
              </span>
              {lesson.completed && <span>✓ Done</span>}
              {lesson.locked && <span>🔒</span>}
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="flex-1 p-6 ml-[20%]">
          {!selectedLesson && (
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="mb-4 text-gray-700">{course.description}</p>
              <div className="flex gap-6 mb-6 text-sm text-gray-600">
                <p>Level: {course.level}</p>
                <p>Type: {course.type}</p>
                <p>Lessons: {course.lesson_count}</p>
                <p>Duration: {course.duration}</p>
                {course.certificate && <p>Certificate Available</p>}
              </div>
            </div>
          )}

          {selectedLesson && selectedLesson.type === "lesson" && (
            <CourseContent 
              lesson={selectedLesson} 
              userId={userId} 
              onCompleted={markLessonCompletedLocally} 
            />
          )}

          {selectedLesson && selectedLesson.type === "quiz" && (
            <CourseQuiz 
              lesson={selectedLesson} 
              backToContent={() => setSelectedLessonIndex(null)} 
              userId={userId} 
              onCompleted={markLessonCompletedLocally} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
