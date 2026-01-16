import React from "react";

interface StatsHeaderProps {
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  streak: number;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  score,
  currentQuestionIndex,
  totalQuestions,
  streak,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/30 p-4 shadow-md">
      {/* Score */}
      <div className="text-center">
        <div className="text-3xl font-extrabold text-indigo-600">
          {score}
        </div>
        <div className="text-sm text-gray-700">Score</div>
      </div>

      {/* Questions */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800">
          {currentQuestionIndex + 1}
          <span className="text-gray-500">/{totalQuestions}</span>
        </div>
        <div className="text-sm text-gray-700">Questions</div>
      </div>

      {/* Streak */}
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-500">
          🔥 {streak}
        </div>
        <div className="text-sm text-gray-700">Streak</div>
      </div>
    </div>
  );
};
