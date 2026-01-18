import React from "react";
import type { Question, AnsweredQuestion } from "../../types/types";
import { StatsHeader } from "../StatsHeader/StatsHeader";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import { Explanation } from "../Explanation/Explanation";

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
  quizQuestionTimerDuration: number;
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
  quizQuestionTimerDuration,
}) => {
  const shouldShowExplanation = showExplanation || !!currentAnsweredQuestion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-200 to-pink-100 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats */}
        <StatsHeader
          score={score}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          streak={streak}
        />

        {/* Content */}
        {shouldShowExplanation ? (
          <>
            {answeredQuestion && (
              <div className="space-y-6">
                <Explanation
                  question={currentQuestion}
                  userAnswer={answeredQuestion.userAnswer}
                  isCorrect={isCorrect}
                />

                <button
                  onClick={onNext}
                  className="w-full rounded-xl bg-purple-500 hover:bg-purple-600 transition-all py-3 text-white font-semibold shadow-lg"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question →"
                    : "See Results"}
                </button>
              </div>
            )}
          </>
        ) : (
          <QuestionCard
            question={currentQuestion}
            userAnswer={userAnswer}
            onAnswerChange={onAnswerChange}
            showExplanation={showExplanation}
            timeLeft={timeLeft}
            totalTime={quizQuestionTimerDuration}
            onSubmit={onSubmit}
            onNext={onNext}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        )}
      </div>
    </div>
  );
};
