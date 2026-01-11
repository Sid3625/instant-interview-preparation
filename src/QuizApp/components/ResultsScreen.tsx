import React from 'react';
import { Trophy } from 'lucide-react';
import type { AnsweredQuestion } from '../types';

interface ResultsScreenProps {
  score: number;
  answeredQuestions: AnsweredQuestion[];
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  answeredQuestions,
  onRestart
}) => {
  const correctCount = answeredQuestions.filter(q => q.correct).length;
  const accuracy = Math.round((correctCount / answeredQuestions.length) * 100);

  return (
    <div className="app-container app-container--results">
      <div className="content-wrapper">
        <div className="card results-card">
          <Trophy className="results-card__trophy" />
          <h2 className="results-card__title">Quiz Complete! 🎉</h2>
          <div className="results-card__score">{score}</div>
          
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-box__value">{correctCount}/{answeredQuestions.length}</div>
              <div className="stat-box__label">Correct</div>
            </div>
            <div className="stat-box">
              <div className="stat-box__value">{accuracy}%</div>
              <div className="stat-box__label">Accuracy</div>
            </div>
          </div>

          <div className="review-section">
            <h3 className="review-section__title">Question Review</h3>
            <div className="review-list">
              {answeredQuestions.map((q, i) => (
                <div key={i} className={`review-item ${q.correct ? 'review-item--correct' : 'review-item--incorrect'}`}>
                  <span className="review-item__info">Q{i + 1}: {q.question.topic}</span>
                  <span className="review-item__points">
                    {q.correct ? '✓' : '✗'} {q.points > 0 ? '+' : ''}{q.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onRestart} className="btn btn--primary btn--large btn--block">
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};