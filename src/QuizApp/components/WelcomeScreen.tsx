import React from 'react';
import { Code, Zap } from 'lucide-react';
import type { Difficulty } from '../types';
import { DifficultySelector } from './DifficultySelector';

interface WelcomeScreenProps {
  onStartGame: (difficulty: Difficulty) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => (
  <div className="app-container app-container--welcome">
    <div className="content-wrapper">
      <div className="header-section">
        <div className="logo-section">
          <Code className="logo-section__icon" />
          <h1 className="logo-section__title">Guess the Output</h1>
        </div>
        <p className="header-section__subtitle">Master JavaScript & React Interview Questions</p>
      </div>

      <div className="card difficulty-card">
        <h2 className="card__title">Choose Difficulty</h2>
        <DifficultySelector onSelectDifficulty={onStartGame} />
      </div>

      <div className="card scoring-card">
        <h3 className="scoring-card__title">
          <Zap className="icon-inline" />
          Scoring System
        </h3>
        <ul className="scoring-card__list">
          <li>✅ Correct answer: <strong>+10 points</strong></li>
          <li>⚡ Fast answer (30s+): <strong>+5 bonus</strong></li>
          <li>🔥 Streak bonus: <strong>+2 per streak</strong></li>
          <li>❌ Wrong answer: <strong>-5 points</strong></li>
          <li>⏱️ Timer: <strong>45 seconds per question</strong></li>
        </ul>
      </div>
    </div>
  </div>
);