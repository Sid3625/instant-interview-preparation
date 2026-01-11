import React from 'react';
import { Timer } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="timer-display">
      <Timer className={`timer-display__icon ${isLow ? 'timer-display__icon--low' : ''}`} />
      <div className="timer-display__bar">
        <div
          className={`timer-display__progress ${isLow ? 'timer-display__progress--low' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`timer-display__text ${isLow ? 'timer-display__text--low' : ''}`}>
        {timeLeft}s
      </span>
    </div>
  );
};