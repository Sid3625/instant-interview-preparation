import React from 'react';
import type { Question } from '../types';
import { CodeBlock } from './CodeBlock';
import { TimerDisplay } from './TimerDisplay';

interface QuestionCardProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  showExplanation: boolean;
  timeLeft: number;
  totalTime: number;
  onSubmit: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  showExplanation,
  timeLeft,
  totalTime,
  onSubmit,
  onNext,
  isLastQuestion
}) => {
  const handleOptionClick = (option: string) => {
    onAnswerChange(option);
  };

  return (
    <div className="card question-card">
      <div className="question-header">
        <div className="tags">
          <span className={`badge badge--${question.difficulty}`}>
            {question.difficulty.toUpperCase()}
          </span>
          <h2 className="tags__topic">Topic: {question.topic}</h2>
        </div>
      </div>

      {!showExplanation && (
        <TimerDisplay timeLeft={timeLeft} totalTime={totalTime} />
      )}

      <h3 className="question-card__title">What will be the output?</h3>
      <CodeBlock code={question.code} />

      {showExplanation ? (
        <button onClick={onNext} className="btn btn--primary btn--block">
          {isLastQuestion ? 'See Results' : 'Next Question →'}
        </button>
      ) : (
        <>
          {question.type === 'mcq' ? (
            <div className="mcq-section">
              <label className="mcq-section__label">Choose the correct answer:</label>
              <div className="mcq-options">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`mcq-option ${userAnswer === option ? 'mcq-option--selected' : ''}`}
                  >
                    <span className="mcq-option__radio">
                      {userAnswer === option && <span className="mcq-option__dot" />}
                    </span>
                    <span className="mcq-option__text">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="answer-section">
              <label className="answer-section__label">Your Answer:</label>
              <textarea
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type the expected output here (e.g., undefined or 1&#10;2&#10;3)"
                className="answer-section__textarea"
                rows={4}
              />
              <p className="answer-section__hint">
                💡 Use Enter for multiple lines (e.g., for multiple console.logs)
              </p>
            </div>
          )}
          <button
            onClick={onSubmit}
            disabled={!userAnswer.trim()}
            className="btn btn--primary btn--block"
          >
            Submit Answer
          </button>
        </>
      )}
    </div>
  );
};