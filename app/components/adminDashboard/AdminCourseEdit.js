"use client";
import React, { useState, useEffect } from "react";
import CourseLessonBlock from "./CourseLessonBlock";
import CourseQuizBlock from "./CourseQuizBlock";

export default function AdminCourseEdit({ courseId, onCancel }) {
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [duration, setDuration] = useState("");
    const [type, setType] = useState("Online");
    const [contentBlocks, setContentBlocks] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState("");

    useEffect(() => {
    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/course/${courseId}`);
            if (!res.ok) throw new Error("Failed to fetch course");
            const data = await res.json();

            setTitle(data.title || "");
            setDescription(data.description || "");
            setLevel(data.level || "Beginner");
            setDuration(data.duration || "");
            setType(data.type || "Online");

            // map lessons/quizzes to contentBlocks
            const blocks = (data.lessons || []).map((l) => {
            if (l.type === "lesson") {
                return {
                id: l.id,
                type: "lesson",
                title: l.title,
                description: l.content || "",
                videoUrl: l.video_url || "",
                };
            } else if (l.type === "quiz") {
                return {
                id: l.id,
                type: "quiz",
                title: l.title,
                description: l.description || "",
                questions: (l.questions || []).map((q) => ({
                    id: q.id,
                    question: q.question,
                    answers: q.answers,
                    correctAnswer: q.correct_answer,
                })),
                };
            }
            });

            setContentBlocks(blocks);
        } catch (err) {
            console.error("Error loading course:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchCourse();
    }, [courseId]);

    const addBlock = (blockType) => {
        const newBlock =
        blockType === "lesson"
            ? { id: Date.now(), type: "lesson", title: "", description: "" }
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
                    correctAnswer: null,
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

    const handleSave = async () => {
        const courseData = { title, description, level, duration, type };
        const lessons = contentBlocks.map((b, index) => {
        if (b.type === "lesson")
            return {
            type: "lesson",
            title: b.title,
            content: b.description,
            video_url: b.videoUrl || "",
            position: index + 1,
            };
        if (b.type === "quiz")
            return {
            type: "quiz",
            title: b.title,
            description: b.description,
            position: index + 1,
            questions: b.questions.map((q) => ({
                question: q.question,
                answers: q.answers,
                correctAnswer: q.correctAnswer,
            })),
            };
        });

        const payload = { course: courseData, lessons };

        console.log("Edit payload to backend:", JSON.stringify(payload, null, 2));
    };

    const handleDelete = async () => {
        if (deleteConfirm !== title) {
        alert("Course name does not match. Cannot delete.");
        return;
        }

        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
        return;
        }

        try {
        const res = await fetch(`/api/course/${courseId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete course");
        alert("Course deleted successfully");
        onCancel(); // go back to course list
        } catch (err) {
        console.error(err);
        alert("Error deleting course");
        }
    };

    if (loading) return <div className="p-6 text-black">Loading course...</div>;

    return (
        <div className="bg-white rounded-xl shadow p-6 w-4/5 mx-auto">
        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">
            Edit Course
        </h2>

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
            type="button"
            className="bg-[#E55B3C] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#c94b2d]"
            >
            + Add Lesson
            </button>
            <button
            onClick={() => addBlock("quiz")}
            type="button"
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
            <button
            onClick={onCancel}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
            Cancel
            </button>
            <button
            onClick={handleSave}
            className="bg-[#E55B3C] text-white px-6 py-2 rounded-lg hover:bg-[#c94b2d]"
            >
            Save Changes
            </button>
        </div>
        </div>
    );
}
