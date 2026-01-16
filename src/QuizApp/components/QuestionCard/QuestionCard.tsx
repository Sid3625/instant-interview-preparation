import React from "react";
import type { Question } from "../../types/types";
import { CodeBlock } from "../CodeBlock/CodeBlock";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";

interface QuestionCardProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  showExplanation: boolean;
  timeLeft: number;
  totalTime: number;
  onSubmit: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  showExplanation,
  timeLeft,
  totalTime,
  onSubmit,
  onNext,
  isLastQuestion,
}) => {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase
              ${
                question.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : question.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {question.difficulty}
          </span>

          <span className="text-sm text-gray-600">
            Topic: <strong className="text-gray-800">{question.topic}</strong>
          </span>
        </div>
      </div>

      {/* Timer */}
      {!showExplanation && (
        <TimerDisplay timeLeft={timeLeft} totalTime={totalTime} />
      )}

      {/* Question */}
      <h3 className="text-xl font-bold text-gray-800">
        What will be the output?
      </h3>

      <CodeBlock code={question.code} />

      {/* Actions */}
      {showExplanation ? (
        <button
          onClick={onNext}
          className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 transition-all py-3 text-white font-semibold shadow-md"
        >
          {isLastQuestion ? "See Results" : "Next Question →"}
        </button>
      ) : (
        <>
          {/* MCQ */}
          {question.type === "mcq" ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Choose the correct answer:
              </p>

              <div className="space-y-2">
                {question.options?.map((option, index) => {
                  const selected = userAnswer === option;

                  return (
                    <button
                      key={index}
                      onClick={() => onAnswerChange(option)}
                      className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all
                        ${
                          selected
                            ? "border-purple-400 bg-purple-50 text-purple-800"
                            : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/40"
                        }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center
                          ${
                            selected
                              ? "border-purple-500"
                              : "border-gray-400"
                          }`}
                      >
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                        )}
                      </span>

                      <span className="font-mono text-sm whitespace-pre-wrap">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Text Answer */
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Your Answer:
              </label>

              <textarea
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type the expected output here (e.g., undefined or 1\n2\n3)"
                rows={4}
                className="w-full rounded-xl bg-white border border-gray-300 p-3 text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <p className="text-xs text-gray-500">
                💡 Use Enter for multiple lines (e.g., multiple console.logs)
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={!userAnswer.trim()}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 text-white font-semibold shadow-md"
          >
            Submit Answer
          </button>
        </>
      )}
    </div>
  );
};
