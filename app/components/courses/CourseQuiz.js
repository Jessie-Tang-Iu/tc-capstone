"use client";

import React, { useState } from "react";

export default function CourseQuiz({ lesson, backToContent }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = lesson?.questions || [];

  const handleSelect = (questionNum, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionNum]: answer }));
  };

  const handleSubmit = () => {
    const total = questions.length;
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) correct++;
    });
    setScore(total > 0 ? Math.round((correct / total) * 100) : 0);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
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
            const correct = userAnswers[i] === q.correctAnswer;
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
                    Correct answer: {q.correctAnswer}
                  </p>
                )}
              </div>
            );
          })}

          <div className="mt-6 flex gap-4">
            <button
              onClick={resetQuiz}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Retake Quiz
            </button>
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
