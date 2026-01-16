import React from "react";
import { Trophy } from "lucide-react";
import type { AnsweredQuestion } from "../../types/types";

interface ResultsScreenProps {
  score: number;
  answeredQuestions: AnsweredQuestion[];
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  answeredQuestions,
  onRestart,
}) => {
  const correctCount = answeredQuestions.filter((q) => q.correct).length;
  const accuracy = Math.round(
    (correctCount / answeredQuestions.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
          {/* Trophy */}
          <Trophy className="mx-auto mb-4 h-12 w-12 text-yellow-500" />

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quiz Complete! 🎉
          </h2>

          <div className="text-5xl font-extrabold text-purple-600 mb-6">
            {score}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl bg-white border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-800">
                {correctCount}/{answeredQuestions.length}
              </div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-800">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
          </div>

          {/* Review */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Question Review
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {answeredQuestions.map((q, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm border
                    ${
                      q.correct
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                >
                  <span className="truncate">
                    Q{i + 1}: {q.question.topic}
                  </span>

                  <span className="font-semibold">
                    {q.correct ? "✓" : "✗"}{" "}
                    {q.points > 0 ? "+" : ""}
                    {q.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition font-semibold py-3 text-white shadow-md"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
