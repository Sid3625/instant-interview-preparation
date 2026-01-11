import React from 'react';
import type { Question, AnsweredQuestion } from '../types';
import { StatsHeader } from './StatsHeader';
import { QuestionCard } from './QuestionCard';
import { Explanation } from './Explanation';
import { TIMER_DURATION } from '../constant';

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswer: string;
  showExplanation: boolean;
  isCorrect: boolean;
  timeLeft: number;
  score: number;
  streak: number;
  currentQuestion: Question;
  answeredQuestion?: AnsweredQuestion;
  onAnswerChange: (answer: string) => void;
  onSubmit: (isTimeout?: boolean) => void;
  onNext: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentQuestionIndex,
  userAnswer,
  showExplanation,
  isCorrect,
  timeLeft,
  score,
  streak,
  currentQuestion,
  answeredQuestion,
  onAnswerChange,
  onSubmit,
  onNext
}) => {
  return (
    <div className="app-container app-container--quiz">
      <div className="content-wrapper">
        <StatsHeader
          score={score}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          streak={streak}
        />

        <div className="card question-card">
          <div className="question-header">
            <div className="tags">
              <span className={`badge badge--${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <h2 className="tags__topic">Topic: {currentQuestion.topic}</h2>
            </div>
          </div>

          {showExplanation ? (
            <>
              {answeredQuestion && (
                <Explanation
                  question={currentQuestion}
                  userAnswer={answeredQuestion.userAnswer}
                  isCorrect={isCorrect}
                />
              )}
              <button onClick={onNext} className="btn btn--primary btn--block">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            </>
          ) : (
            <QuestionCard
              question={currentQuestion}
              userAnswer={userAnswer}
              onAnswerChange={onAnswerChange}
              showExplanation={showExplanation}
              timeLeft={timeLeft}
              totalTime={TIMER_DURATION}
              onSubmit={() => onSubmit(false)}
              onNext={onNext}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};