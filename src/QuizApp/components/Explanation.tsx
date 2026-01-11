import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { Question } from '../types';

interface ExplanationProps {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

export const Explanation: React.FC<ExplanationProps> = ({
  question,
  userAnswer,
  isCorrect
}) => (
  <div className={`explanation ${isCorrect ? 'explanation--correct' : 'explanation--incorrect'}`}>
    <div className="explanation__header">
      {isCorrect ? (
        <CheckCircle className="explanation__icon" />
      ) : (
        <XCircle className="explanation__icon" />
      )}
      <div className="explanation__content">
        <h3 className="explanation__title">{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h3>
        {!isCorrect && (
          <div className="explanation__comparison">
            <div className="answer-block">
              <p className="answer-block__label">Your answer:</p>
              <pre className="answer-block__code">{userAnswer || '(no answer)'}</pre>
            </div>
            <div className="answer-block">
              <p className="answer-block__label">Correct answer:</p>
              <pre className="answer-block__code">{question.correctAnswer}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="explanation__box">
      <h4 className="explanation__box-title">
        <AlertCircle className="icon-small" />
        Explanation:
      </h4>
      <p className="explanation__box-text">{question.explanation}</p>
    </div>
  </div>
);