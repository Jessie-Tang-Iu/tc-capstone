"use client";
import React, { useEffect, useState } from "react";

export default function AdminCourseOverview({ courseId, onBack, onEdit }) {
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);

    // Tabs: "course" or "users"
    const [activeTab, setActiveTab] = useState("course");

    // Lesson selector state
    const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

    // stores all user progress data for display
    const [userProgress, setUserProgress] = useState([]);

    useEffect(() => {
        const loadCourse = async () => {
        try {
            const res = await fetch(`/api/course/admin/${courseId}`);
            if (!res.ok) throw new Error("Failed to load course");
            const data = await res.json();
            
            setCourse(data);

            // Initialize lesson selection to first lesson
            if (data.lessons && data.lessons.length > 0) {
            setSelectedLessonIndex(0);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        loadCourse();
    }, [courseId]);

    useEffect(() => {
        if (activeTab === "users") {
            loadUserProgress();
        }
    }, [activeTab]);

    const loadUserProgress = async () => {
        try {
            const res = await fetch(`/api/admin/courseProgress/${courseId}`);
            if (!res.ok) throw new Error("Failed to load user progress");
            const data = await res.json();
            setUserProgress(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-6 text-black">Loading...</div>;
    if (!course) return <div className="p-6 text-black">Course not found.</div>;

    const lessons = course.lessons || [];
    const selectedLesson = lessons[selectedLessonIndex] || null;

    const goPrev = () => {
        if (selectedLessonIndex > 0) {
        setSelectedLessonIndex(selectedLessonIndex - 1);
        }
    };

    const goNext = () => {
        if (selectedLessonIndex < lessons.length - 1) {
        setSelectedLessonIndex(selectedLessonIndex + 1);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 w-4/5 mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-[#E55B3C]">Course Overview</h2>
                <button
                onClick={onBack}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                >
                Back
                </button>
            </div>

            {/* Course Overview Section */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                <h3 className="text-sm text-gray-700 font-semibold">Title</h3>
                <p className="text-black">{course.title}</p>
                </div>
                <div>
                <h3 className="text-sm text-gray-700 font-semibold">Level</h3>
                <p className="text-black">{course.level}</p>
                </div>

                <div>
                <h3 className="text-sm text-gray-700 font-semibold">Type</h3>
                <p className="text-black">{course.type}</p>
                </div>

                <div>
                <h3 className="text-sm text-gray-700 font-semibold">Duration</h3>
                <p className="text-black">{course.duration}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm text-gray-700 font-semibold mb-1">Description</h3>
                <p className="text-black whitespace-pre-wrap">{course.description}</p>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mb-10">
                <button
                onClick={onEdit}
                className="bg-[#E55B3C] text-white px-6 py-2 rounded-lg hover:bg-[#c94b2d] transition cursor-pointer"
                >
                Edit Course
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b mb-6 flex gap-8">
                <button
                onClick={() => setActiveTab("course")}
                className={`pb-2 ${
                    activeTab === "course"
                    ? "text-[#E55B3C] border-b-2 border-[#E55B3C]"
                    : "text-gray-600 cursor-pointer hover:border-b-2 border-gray-300 transition"
                }`}
                >
                Course Data
                </button>

                <button
                onClick={() => setActiveTab("users")}
                className={`pb-2 ${
                    activeTab === "users"
                    ? "text-[#E55B3C] border-b-2 border-[#E55B3C]"
                    : "text-gray-600 cursor-pointer hover:border-b-2 border-gray-300 transition"
                }`}
                >
                User Data
                </button>
            </div>

            {/* Course Data Display*/}
            {activeTab === "course" && (
                <div className="space-y-8">

                {lessons.length === 0 && (
                    <p className="text-gray-600">No lessons added yet.</p>
                )}

                {lessons.length > 0 && (
                    <div className="border rounded-lg p-6 shadow-sm bg-[#fafafa]">

                    {/* Lesson Navigator */}
                    <div className="flex items-center justify-between mb-4">

                        <button
                        onClick={goPrev}
                        disabled={selectedLessonIndex === 0}
                        className={`px-3 py-1 rounded ${
                            selectedLessonIndex === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer transition"
                        }`}
                        >
                            {"<"}
                        </button>

                        <select
                        value={selectedLessonIndex}
                        onChange={(e) => setSelectedLessonIndex(Number(e.target.value))}
                        className="border rounded p-2 text-black cursor-pointer"
                        >
                        {lessons.map((l, idx) => (
                            <option key={l.id} value={idx}>
                            {l.position}. {l.title}
                            </option>
                        ))}
                        </select>


                        <button
                        onClick={goNext}
                        disabled={selectedLessonIndex === lessons.length - 1}
                        className={`px-3 py-1 rounded ${
                            selectedLessonIndex === lessons.length - 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer transition"
                        }`}
                        >
                            {">"}
                        </button>
                    </div>

                    {/* Lesson/Quiz Content Display */}
                    <div className="mt-6">

                        <h3 className="text-2xl font-semibold text-[#E55B3C] mb-2">
                        {selectedLesson.title}
                        </h3>

                        {selectedLesson.type === "lesson" && (
                        <div className="space-y-4 text-black">
                            {selectedLesson.video_url && (
                            <div>
                                <p className="text-sm text-gray-700 font-semibold mb-2">Video</p>

                                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={selectedLesson.video_url}
                                    title={selectedLesson.title}
                                    allowFullScreen
                                ></iframe>
                                </div>
                            </div>
                            )}

                            <div>
                            <p className="text-sm text-gray-700 font-semibold">Content</p>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{
                                __html: selectedLesson.content || "<p>No content</p>",
                                }}
                            />
                            </div>
                        </div>
                        )}

                        {selectedLesson.type === "quiz" && (
                        <div className="space-y-4 text-black">
                            <p className="text-sm text-gray-700 font-semibold">Quiz</p>

                            {selectedLesson.questions.map((q, i) => (
                            <div key={q.id} className="border rounded p-3 bg-white">
                                <p className="font-semibold mb-2">
                                {i + 1}. {q.question}
                                </p>
                                <ul className="list-disc ml-6">
                                {q.answers.map((ans, idx) => (
                                    <li
                                    key={idx}
                                    className={
                                        ans === q.correctAnswer
                                        ? "text-green-600 font-bold underline"
                                        : ""
                                    }
                                    >
                                    {ans}
                                    </li>
                                ))}
                                </ul>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    </div>
                )}
                </div>
            )}

            {activeTab === "users" && (
                <div className="border rounded-lg p-6 shadow-sm bg-[#fafafa]">
                    <h3 className="text-xl font-semibold text-[#E55B3C] mb-4">
                    User Progress
                    </h3>

                    {userProgress.length === 0 && (
                    <p className="text-gray-600">No users have started this course yet.</p>
                    )}

                    {userProgress.length > 0 && (
                    <table className="w-full text-left text-black border-collapse">
                        <thead>
                        <tr className="border-b bg-gray-100">
                            <th className="p-2">User</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Progress</th>
                            <th className="p-2">Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userProgress.map((u) => (
                            <tr
                                key={u.user_id}
                                className="border-b"
                            >
                            <td className="p-2">{u.first_name} {u.last_name}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">
                                {u.completed_lessons}/{u.total_lessons}
                            </td>
                            <td className="p-2">
                                {u.completed ? "Yes" : "No"}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    )}
                </div>
            )}
        </div>
    );
}
