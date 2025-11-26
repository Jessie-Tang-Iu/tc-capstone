"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CourseQuiz({ lesson, backToContent, onCompleted }) {
  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id; // Clerk user ID used for saving progress

  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const questions = lesson?.questions || [];

  const handleSelect = (questionNum, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionNum]: answer }));
  };

  const handleSubmit = () => {
    const total = questions.length;
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct_answer) correct++;
    });
    setScore(total > 0 ? Math.round((correct / total) * 100) : 0);
    setSubmitted(true);
  };

  const handleSaveProgress = async () => {
    if (score < 50) return;
    setSaving(true);
    try {
      console.log("Submitting progress:", { userId, lessonId: lesson.id, score });
      const res = await fetch("/api/course/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lessonId: lesson.id, score }),
      });
      if (!res.ok) throw new Error("Failed to save quiz progress");
      const data = await res.json();
      console.log("Response:", res.status, data);
      console.log("Quiz completion saved:", data);
      if (res.ok) {
        setSaved(true);
        onCompleted?.(lesson.id);
      }
    } catch (err) {
      console.error("Error saving quiz progress:", err);
    } finally {
      setSaving(false);
    }
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    setSaved(false);
  };

  return (
    <div>
      {!submitted ? (
        <>
          {questions.map((q, i) => (
            <div key={i} className="mb-6 border-b pb-4">
              <p className="font-medium mb-2">
                {i + 1}. {q.question}
              </p>
              <div className="ml-6">
                {(q.answers || []).map((ans, j) => (
                  <label key={j} className="block mb-1">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={ans}
                      checked={userAnswers[i] === ans}
                      onChange={() => handleSelect(i, ans)}
                      className="mr-2"
                    />
                    {ans}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-[#E55B3C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c94b2d]"
          >
            Submit Quiz
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
          <p className="mb-6 text-lg font-medium text-green-700">
            Score: {score}%
          </p>

          {questions.map((q, i) => {
            const correct = userAnswers[i] === q.correct_answer;
            return (
              <div
                key={i}
                className={`mb-4 border-l-4 p-3 ${
                  correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                }`}
              >
                <p className="font-semibold">{q.question}</p>
                <p className="text-sm mt-1">
                  Your answer:{" "}
                  <span className={correct ? "text-green-700" : "text-red-700"}>
                    {userAnswers[i] || "No answer"}
                  </span>
                </p>
                {!correct && (
                  <p className="text-sm text-gray-700">
                    Correct answer: {q.correct_answer}
                  </p>
                )}
              </div>
            );
          })}

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={resetQuiz}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Retake Quiz
            </button>

            {score >= 50 && !saved && (
              <button
                onClick={handleSaveProgress}
                disabled={saving}
                className={`${
                  saving ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 rounded-lg font-semibold`}
              >
                {saving ? "Saving..." : "Save Progress"}
              </button>
            )}

            {saved && (
              <span className="text-green-700 font-medium mt-2">
                ✓ Progress Saved
              </span>
            )}

            <button
              onClick={backToContent}
              className="bg-[#E55B3C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c94b2d]"
            >
              Back to Content
            </button>
          </div>
        </>
      )}
    </div>
  );
}
