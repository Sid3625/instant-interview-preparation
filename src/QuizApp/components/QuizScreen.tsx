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
    currentAnsweredQuestion?: AnsweredQuestion;
  answeredQuestion?: AnsweredQuestion;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onReset?: () => void;
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
  currentAnsweredQuestion,
  answeredQuestion,
  onAnswerChange,
  onSubmit,
  onNext,
}) => {
 

  const shouldShowExplanation = showExplanation || !!currentAnsweredQuestion;

  return (
    <div className="app-container app-container--quiz">
      <div className="content-wrapper">

        <StatsHeader
          score={score}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          streak={streak}
        />

          {shouldShowExplanation ? (
            <>
              {answeredQuestion && (
                <>
                  <Explanation
                    question={currentQuestion}
                    userAnswer={answeredQuestion.userAnswer}
                    isCorrect={isCorrect}
                  />

                  <button
                    onClick={onNext}
                    className="btn btn--primary btn--block"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? 'Next Question →'
                      : 'See Results'}
                  </button>
                </>
              )}
            </>
          ) : (
            <QuestionCard
              question={currentQuestion}
              userAnswer={userAnswer}
              onAnswerChange={onAnswerChange}
              showExplanation={showExplanation}
              timeLeft={timeLeft}
              totalTime={TIMER_DURATION}
              onSubmit={() => onSubmit()}
              onNext={onNext}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          )}
        </div>
      </div>
 
  );
};
