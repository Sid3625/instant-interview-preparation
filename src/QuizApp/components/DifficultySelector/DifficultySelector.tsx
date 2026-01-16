import React from "react";
import type { Difficulty } from "../../types/types";

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty | null) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  onSelectDifficulty,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Easy */}
      <button
        onClick={() => onSelectDifficulty("easy")}
        className="group rounded-2xl border border-green-200 bg-green-50 p-6 text-left transition-all
                   hover:scale-105 hover:border-green-300 hover:shadow-md focus:outline-none"
      >
        <div className="text-3xl mb-3">🟢</div>
        <h3 className="text-xl font-bold text-green-800 mb-1">
          Easy
        </h3>
        <p className="text-sm text-gray-600">
          Basics, hoisting, map/filter
        </p>
      </button>

      {/* Medium */}
      <button
        onClick={() => onSelectDifficulty("medium")}
        className="group rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-left transition-all
                   hover:scale-105 hover:border-yellow-300 hover:shadow-md focus:outline-none"
      >
        <div className="text-3xl mb-3">🟡</div>
        <h3 className="text-xl font-bold text-yellow-800 mb-1">
          Medium
        </h3>
        <p className="text-sm text-gray-600">
          Closures, async/await, hooks
        </p>
      </button>

      {/* Hard */}
      <button
        onClick={() => onSelectDifficulty("hard")}
        className="group rounded-2xl border border-red-200 bg-red-50 p-6 text-left transition-all
                   hover:scale-105 hover:border-red-300 hover:shadow-md focus:outline-none"
      >
        <div className="text-3xl mb-3">🔴</div>
        <h3 className="text-xl font-bold text-red-800 mb-1">
          Hard
        </h3>
        <p className="text-sm text-gray-600">
          Event loop, stale closures, memoization
        </p>
      </button>

      {/* All Levels */}
      <button
        onClick={() => onSelectDifficulty(null)}
        className="group rounded-2xl border border-purple-200 bg-purple-50 p-6 text-left transition-all
                   hover:scale-105 hover:border-purple-300 hover:shadow-md focus:outline-none"
      >
        <div className="text-3xl mb-3">🌈</div>
        <h3 className="text-xl font-bold text-purple-800 mb-1">
          All Levels
        </h3>
        <p className="text-sm text-gray-600">
          Mixed difficulty challenge
        </p>
      </button>
    </div>
  );
};
