import React from "react";
import { Code, Zap } from "lucide-react";
import type { Difficulty } from "../../types/types";
import { DifficultySelector } from "../DifficultySelector/DifficultySelector";

interface WelcomeScreenProps {
  onStartGame: (difficulty: Difficulty | null) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code className="text-purple-600" size={40} />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
              Guess the Output
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Master JavaScript & React Interview Questions
          </p>
        </div>

        {/* Difficulty Card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Choose Difficulty
          </h2>
          <DifficultySelector onSelectDifficulty={onStartGame} />
        </div>

        {/* Scoring Card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md">
          <h3 className="flex items-center gap-2 text-xl font-bold text-purple-700 mb-4">
            <Zap size={22} />
            Scoring System
          </h3>

          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              ✅ Correct answer:{" "}
              <strong className="text-green-600">+10 points</strong>
            </li>
            <li>
              ⚡ Fast answer (30s+):{" "}
              <strong className="text-blue-600">+5 bonus</strong>
            </li>
            <li>
              🔥 Streak bonus:{" "}
              <strong className="text-purple-600">+2 per streak</strong>
            </li>
            <li>
              ❌ Wrong answer:{" "}
              <strong className="text-red-600">-5 points</strong>
            </li>
            <li>
              ⏱️ Timer:{" "}
              <strong className="text-orange-600">
                45 seconds per question
              </strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
