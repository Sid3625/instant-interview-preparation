import React from "react";
import { Timer } from "lucide-react";

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
  const isCritical = timeLeft <= 10;
  const isWarning = timeLeft <= 30;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const statusText = isCritical
    ? "Almost out of time"
    : isWarning
    ? "Hurry up"
    : "Plenty of time";

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
      {/* Icon */}
      <Timer
        className={`w-5 h-5 transition-all
          ${
            isCritical
              ? "text-red-500 animate-pulse"
              : isWarning
              ? "text-orange-500"
              : "text-purple-500"
          }`}
      />

      {/* Time */}
      <span
        className={`text-sm font-semibold min-w-[52px]
          ${
            isCritical
              ? "text-red-600"
              : isWarning
              ? "text-orange-600"
              : "text-gray-700"
          }`}
      >
        {formatTime(timeLeft)}
      </span>

      {/* Status */}
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full
          ${
            isCritical
              ? "bg-red-100 text-red-700"
              : isWarning
              ? "bg-orange-100 text-orange-700"
              : "bg-purple-100 text-purple-700"
          }`}
      >
        {statusText}
      </span>
    </div>
  );
};
