"use client";
import React from "react";

export default function CourseQuizBlock({ index, quiz, onChange, onRemove }) {
  const updateQuestion = (qIndex, updatedQuestion) => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions[qIndex] = updatedQuestion;
    onChange(updatedQuiz);
  };

  const handleCorrectAnswerSelect = (qIndex, selectedAnswer) => {
    const updatedQuestion = {
      ...quiz.questions[qIndex],
      correctAnswer: selectedAnswer,
    };
    updateQuestion(qIndex, updatedQuestion);
  };

  return (
    <div className="border-2 border-[#6C63FF] bg-[#f4f3ff] rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-[#6C63FF]">Quiz {index + 1}</h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
        >
          Remove
        </button>
      </div>

      <input
        type="text"
        placeholder="Quiz title"
        value={quiz.title}
        onChange={(e) => onChange({ ...quiz, title: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 text-sm text-black mb-2"
      />

      <textarea
        placeholder="Quiz description or instructions"
        value={quiz.description}
        onChange={(e) => onChange({ ...quiz, description: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 text-sm text-black mb-4"
        rows={2}
      />

      {quiz.questions.map((q, qIndex) => (
        <div
          key={q.id ?? `q-${qIndex}`}
          className="border border-gray-300 bg-white rounded-lg p-3 mb-3"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-700 text-sm">
              Question {qIndex + 1}
            </h4>
            <button
              type="button"
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => {
                const updatedQuiz = { ...quiz };
                updatedQuiz.questions = updatedQuiz.questions.filter(
                  (_, i) => i !== qIndex
                );
                onChange(updatedQuiz);
              }}
            >
              Remove Question
            </button>
          </div>

          <input
            value={q.question}
            onChange={(e) => {
              updateQuestion(qIndex, { ...q, question: e.target.value });
            }}
            className="w-full border border-gray-300 rounded p-2 text-sm text-black mb-2"
            placeholder="Enter question text"
          />

          {q.answers.map((ans, aIndex) => (
            <div key={aIndex} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                checked={q.correctAnswer === ans}
                onChange={() => handleCorrectAnswerSelect(qIndex, ans)}
              />
              <input
                value={ans}
                onChange={(e) => {
                  const updatedAnswers = [...q.answers];
                  updatedAnswers[aIndex] = e.target.value;

                  let updatedCorrect = q.correctAnswer;
                  if (q.correctAnswer === ans) {
                    updatedCorrect = e.target.value;
                  }

                  updateQuestion(qIndex, {
                    ...q,
                    answers: updatedAnswers,
                    correctAnswer: updatedCorrect,
                  });
                }}
                className="flex-1 border border-gray-300 rounded p-2 text-sm text-black"
                placeholder={`Answer ${aIndex + 1}`}
              />
            </div>
          ))}

          {q.answers.length < 5 && (
            <button
              type="button"
              onClick={() => {
                const updatedAnswers = [...q.answers, ""];
                updateQuestion(qIndex, { ...q, answers: updatedAnswers });
              }}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              + Add Answer
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          const newQuestion = {
            id: Date.now(),
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: null,
          };
          onChange({ ...quiz, questions: [...quiz.questions, newQuestion] });
        }}
        className="text-sm text-[#6C63FF] hover:text-[#524ccf] mt-2"
      >
        + Add Question
      </button>
    </div>
  );
}
