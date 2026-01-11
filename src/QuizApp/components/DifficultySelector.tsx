import React from 'react';
import type { Difficulty } from '../types';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty }) => (
  <div className="difficulty-grid">
    <button onClick={() => onSelectDifficulty('easy')} className="difficulty-btn difficulty-btn--easy">
      <div className="difficulty-btn__emoji">🟢</div>
      <h3 className="difficulty-btn__title">Easy</h3>
      <p className="difficulty-btn__description">Basics, hoisting, map/filter</p>
    </button>
    <button onClick={() => onSelectDifficulty('medium')} className="difficulty-btn difficulty-btn--medium">
      <div className="difficulty-btn__emoji">🟡</div>
      <h3 className="difficulty-btn__title">Medium</h3>
      <p className="difficulty-btn__description">Closures, async/await, hooks</p>
    </button>
    <button onClick={() => onSelectDifficulty('hard')} className="difficulty-btn difficulty-btn--hard">
      <div className="difficulty-btn__emoji">🔴</div>
      <h3 className="difficulty-btn__title">Hard</h3>
      <p className="difficulty-btn__description">Event loop, stale closures, memoization</p>
    </button>
    <button onClick={() => onSelectDifficulty(null)} className="difficulty-btn difficulty-btn--all">
      <div className="difficulty-btn__emoji">🌈</div>
      <h3 className="difficulty-btn__title">All Levels</h3>
      <p className="difficulty-btn__description">Mixed difficulty challenge</p>
    </button>
  </div>
);