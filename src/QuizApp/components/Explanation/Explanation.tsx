import React from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import type { Question } from "../../types/types";

interface ExplanationProps {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

export const Explanation: React.FC<ExplanationProps> = ({
  question,
  userAnswer,
  isCorrect,
}) => {
  return (
    <div
      className={`rounded-2xl border p-6 mt-6 shadow-sm
        ${
          isCorrect
            ? "border-green-200 bg-green-50"
            : "border-blue-200 bg-blue-50"
        }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {isCorrect ? (
          <CheckCircle className="text-green-600 mt-1" size={28} />
        ) : (
          <XCircle className="text-red-600 mt-1" size={28} />
        )}

        <div className="flex-1">
          <h3
            className={`text-xl font-bold mb-4
              ${
                isCorrect
                  ? "text-green-700"
                  : "text-red-700"
              }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </h3>

          {/* Comparison */}
          {!isCorrect && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl bg-white p-4 border border-gray-200">
                <p className="text-md uppercase tracking-wide text-black-500 mb-2">
                  Your answer
                </p>
                <pre className="text-md text-red-600 font-mono whitespace-pre-wrap">
                  {userAnswer || "(no answer)"}
                </pre>
              </div>

              <div className="rounded-xl bg-white p-4 border border-gray-200">
                <p className="text-md uppercase tracking-wide text-black-500 mb-2">
                  Correct answer
                </p>
                <pre className="text-md text-green-700 font-mono whitespace-pre-wrap">
                  {question.correctAnswer}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation box */}
      <div className="mt-4 rounded-xl bg-purple-50 p-4 border border-purple-200">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
          <AlertCircle size={16} />
          Explanation
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {question.explanation}
        </p>
      </div>
    </div>
  );
};
