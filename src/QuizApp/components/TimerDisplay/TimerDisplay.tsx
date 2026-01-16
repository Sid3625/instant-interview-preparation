import React from "react";
import { Timer } from "lucide-react";

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
}) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
      {/* Icon */}
      <Timer
        className={`w-5 h-5 transition-colors
          ${
            isLow
              ? "text-red-500 animate-pulse"
              : "text-purple-500"
          }`}
      />

      {/* Progress Bar */}
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out
            ${
              isLow
                ? "bg-red-400"
                : "bg-purple-400"
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Time Text */}
      <span
        className={`text-sm font-semibold min-w-[36px] text-right
          ${
            isLow
              ? "text-red-600"
              : "text-gray-700"
          }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
};
