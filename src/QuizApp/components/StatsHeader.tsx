import React from 'react';

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
  streak
}) => (
  <div className="card stats-header">
    <div className="stat-item">
      <div className="stat-item__value stat-item__value--primary">{score}</div>
      <div className="stat-item__label">Score</div>
    </div>
    <div className="stat-item">
      <div className="stat-item__value">{currentQuestionIndex + 1}/{totalQuestions}</div>
      <div className="stat-item__label">Questions</div>
    </div>
    <div className="stat-item">
      <div className="stat-item__value stat-item__value--streak">🔥 {streak}</div>
      <div className="stat-item__label">Streak</div>
    </div>
  </div>
);