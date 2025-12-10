"use client";
import React, { useState, useEffect } from "react";
import CourseLessonBlock from "./CourseLessonBlock";
import CourseQuizBlock from "./CourseQuizBlock";

export default function AdminCourseEdit({ courseId, onCancel, onDelete, onRefresh }) {
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [duration, setDuration] = useState("");
    const [type, setType] = useState("Online");
    const [contentBlocks, setContentBlocks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/course/admin/${courseId}`);
            if (!res.ok) throw new Error("Failed to fetch course");
            const data = await res.json();

            setTitle(data.title || "");
            setDescription(data.description || "");
            setLevel(data.level || "Beginner");
            setDuration(data.duration || "");
            setType(data.type || "Online");

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
                    description: l.content || "",
                    questions: (l.questions || []).map((q) => ({
                        id: q.id,
                        question: q.question,
                        answers: q.answers,
                        correctAnswer: q.correctAnswer,
                    })),
                };
            }
            });

            console.log("Loaded content blocks:", blocks);
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
        const lessons = contentBlocks.map((block, index) => {
        if (block.type === "lesson") {
            return {
            type: "lesson",
            title: block.title,
            content: block.description,
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
                correctAnswer: q.correctAnswer,
            })),
            };
        }
        });

        const payload = { course: courseData, lessons };

        try {
        console.log("Saving course with payload:", payload);
        const res = await fetch(`/api/course/${courseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update course");
        alert("Course updated successfully");
        onCancel();
        onRefresh();
        } catch (err) {
        console.error(err);
        alert("Error updating course");
        }
    };

    const handleDelete = async () => {
        if (deleteConfirm !== title) {
        alert("Course name does not match. Cannot delete.");
        return;
        }

        try {
        const res = await fetch(`/api/course/${courseId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete course");
            alert("Course deleted successfully");
            onDelete();
            onRefresh();
        } catch (err) {
        console.error(err);
            alert("Error deleting course");
        }
    };

    if (loading) return <div className="p-6 text-black bg-white">Loading course...</div>;

    return (
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Edit Course</h2>

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
                className="w-full border border-gray-300 rounded p-2 text-sm text-black cursor-pointer"
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
                className="w-full border border-gray-300 rounded p-2 text-sm text-black cursor-pointer"
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
                className="bg-[#E55B3C] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#c94b2d] cursor-pointer"
            >
                + Add Lesson
            </button>
            <button
                onClick={() => addBlock("quiz")}
                type="button"
                className="bg-[#6C63FF] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#5951d8] cursor-pointer"
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
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
            >
            Cancel
            </button>
            <div className="flex gap-4">
            <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 cursor-pointer"
            >
                Delete Course
            </button>
            <button
                onClick={handleSave}
                className="bg-[#E55B3C] text-white px-6 py-2 rounded-lg hover:bg-[#c94b2d] cursor-pointer"
            >
                Save Changes
            </button>
            </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                Confirm Delete
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                Type the course name <strong>{title}</strong> to confirm deletion:
                </p>
                <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="w-full border border-gray-300 text-black rounded p-2 mb-4 text-sm"
                />
                <div className="flex justify-end gap-4">
                <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    className={`px-4 py-2 rounded text-white
                        ${
                        deleteConfirm === title
                            ? "bg-red-600 hover:bg-red-500 cursor-pointer transition"
                            : "bg-red-300 cursor-not-allowed"
                        }
                    `}
                >
                    Delete
                </button>
                </div>
            </div>
            </div>
        )}
      </div>
    );
}
