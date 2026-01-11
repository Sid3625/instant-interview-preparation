import React, { useState, useCallback, useMemo } from 'react';
import questionsData from '../data/data.json';
import type { Question, QuizState, Difficulty } from './types';
import { useTimer } from './hooks/useTimer';
import { useScore } from './hooks/useScore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';

export const QuizApp: React.FC = () => {
  // State
  const [quizState, setQuizState] = useState<QuizState>({
    difficulty: null,
    currentQuestionIndex: 0,
    userAnswer: '',
    showExplanation: false,
    isCorrect: false,
    gameStarted: false,
    gameFinished: false,
    answeredQuestions: []
  });

  // Hooks
  const { score, streak, addScore, reset: resetScore } = useScore();
  const TIMER_DURATION = 45;

  // Timer timeout handler
  const handleTimeout = useCallback(() => {
    if (!quizState.showExplanation) {
      handleSubmit(true);
    }
  }, [quizState.showExplanation]);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(TIMER_DURATION, handleTimeout);

  // Filter and shuffle questions
  const questions = useMemo<Question[]>(() => {
    if (!quizState.gameStarted) return [];

    const sourceQuestions = questionsData.questions as Question[];
    const filtered = quizState.difficulty
      ? sourceQuestions.filter(q => q.difficulty === quizState.difficulty)
      : sourceQuestions;

    return [...filtered].sort(() => Math.random() - 0.5);
  }, [quizState.gameStarted, quizState.difficulty]);

  const currentQuestion = questions[quizState.currentQuestionIndex];

  // Helper functions
  const normalizeAnswer = (answer: string): string => {
    return answer.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setQuizState({
      difficulty: selectedDifficulty,
      currentQuestionIndex: 0,
      userAnswer: '',
      showExplanation: false,
      isCorrect: false,
      gameStarted: true,
      gameFinished: false,
      answeredQuestions: []
    });
    resetScore();
    resetTimer(TIMER_DURATION);
    startTimer();
  }, [resetScore, resetTimer, startTimer]);

  const handleSubmit = useCallback((isTimeout = false) => {
    if (!currentQuestion) return;

    const correct = normalizeAnswer(quizState.userAnswer) === 
                    normalizeAnswer(currentQuestion.correctAnswer);
    
    let points = 0;
    if (correct) {
      const timeBonus = !isTimeout && timeLeft > 30 ? 5 : 0;
      points = 10 + timeBonus + (streak * 2);
    } else {
      points = isTimeout ? -10 : -5;
    }

    addScore(points, correct);

    const answeredQuestion = {
      question: currentQuestion,
      userAnswer: isTimeout ? '(timeout - no answer)' : quizState.userAnswer,
      correct,
      points
    };

    setQuizState(prev => ({
      ...prev,
      showExplanation: true,
      isCorrect: correct,
      answeredQuestions: [...prev.answeredQuestions, answeredQuestion]
    }));
  }, [currentQuestion, quizState.userAnswer, timeLeft, streak, addScore]);

  const handleNext = useCallback(() => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        userAnswer: '',
        showExplanation: false
      }));
      resetTimer(TIMER_DURATION);
      startTimer();
    } else {
      setQuizState(prev => ({ ...prev, gameFinished: true }));
    }
  }, [quizState.currentQuestionIndex, questions.length, resetTimer, startTimer]);

  const restartQuiz = useCallback(() => {
    setQuizState({
      difficulty: null,
      currentQuestionIndex: 0,
      userAnswer: '',
      showExplanation: false,
      isCorrect: false,
      gameStarted: false,
      gameFinished: false,
      answeredQuestions: []
    });
    resetScore();
  }, [resetScore]);

  const handleAnswerChange = useCallback((answer: string) => {
    setQuizState(prev => ({ ...prev, userAnswer: answer }));
  }, []);

  // Loading states
  if (!quizState.gameStarted) {
    return <WelcomeScreen onStartGame={startGame} />;
  }

  if (quizState.gameFinished) {
    return (
      <ResultsScreen
        score={score}
        answeredQuestions={quizState.answeredQuestions}
        onRestart={restartQuiz}
      />
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return <div className="app-container"><div className="content-wrapper">Loading...</div></div>;
  }

  const currentAnsweredQuestion = quizState.answeredQuestions[quizState.currentQuestionIndex];

  return (
    <QuizScreen
      questions={questions}
      currentQuestionIndex={quizState.currentQuestionIndex}
      userAnswer={quizState.userAnswer}
      showExplanation={quizState.showExplanation}
      isCorrect={quizState.isCorrect}
      timeLeft={timeLeft}
      score={score}
      streak={streak}
      currentQuestion={currentQuestion}
      answeredQuestion={currentAnsweredQuestion}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleSubmit}
      onNext={handleNext}
    />
  );
};