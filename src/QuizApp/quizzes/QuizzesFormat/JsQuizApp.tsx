import React, {  useCallback, useEffect } from 'react';
import questionsData from '../../../data/data.json';
import type { Question, Difficulty } from '../../types/types';
import { useQuizStore } from '../../store/quizStore';
import { useTimerEffect, useTimerResume } from '../../hooks/useTimer';
import { QuizScreen } from '../../components/Screens/QuizScreen';
import { ResultsScreen } from '../../components/Screens/ResultsScreen';
import { WelcomeScreen } from '../../components/Screens/WelcomeScreen';


export const JsQuizApp: React.FC = () => {
  const {

    difficulty,
    currentQuestionIndex,
    userAnswer,
    showExplanation,
    isCorrect,
    gameStarted,
    gameFinished,
    answeredQuestions,
    score,
    streak,
    timeLeft,
    isTimerActive,
    questions,
    
    setShowExplanation,
    setIsCorrect, 
    setUserAnswer,
    setQuestions,
    startGame: storeStartGame,
    submitAnswer: storeSubmitAnswer,
    nextQuestion: storeNextQuestion,
    restartQuiz: storeRestartQuiz,
    resetGame,
    setIsTimerActive,
    setLastUpdateTime,
  } = useQuizStore();

 

  //   useEffect(() => {
  //   restoreState();
  // }, [restoreState]);

  // Handle timer resume on component mount
  useTimerResume();
  const currentQuestion = questions[currentQuestionIndex];

  // Handle timer timeout
  const handleTimeout = useCallback(() => {
    if (!showExplanation && currentQuestion) {
      storeSubmitAnswer({
        question: currentQuestion,
        userAnswer: '',
        isTimeout: true,
        timeLeft,
        streak,
      });
    }
  }, [showExplanation, currentQuestion, timeLeft, streak, storeSubmitAnswer]);

  // Timer effect
  useTimerEffect(handleTimeout);

  // Filter and shuffle questions when difficulty changes
  useEffect(() => {
    if (gameStarted && questions.length === 0) {
      const sourceQuestions = questionsData.questions as Question[];
      const filtered = difficulty
        ? sourceQuestions.filter(q => q.difficulty === difficulty)
        : sourceQuestions;
      
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
  }, [gameStarted, difficulty, questions.length, setQuestions]);



  // Start game handler
  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    storeStartGame(selectedDifficulty);
  }, [storeStartGame]);

  const submitAnswer = useCallback((isTimeout = false) => {
    if (!currentQuestion) return;
    
    storeSubmitAnswer({
      question: currentQuestion,
      userAnswer: isTimeout ? '' : userAnswer,
      isTimeout,
      timeLeft,
      streak,
    });
  }, [currentQuestion, userAnswer, timeLeft, streak, storeSubmitAnswer]);

  // Next question handler
  const nextQuestion = useCallback(() => {
    storeNextQuestion();
  }, [storeNextQuestion]);

  // Restart quiz handler
  const restartQuiz = useCallback(() => {
    storeRestartQuiz();
  }, [storeRestartQuiz]);

  // Resume timer on page refresh if needed
  useEffect(() => {
    if (gameStarted && !gameFinished && !showExplanation && isTimerActive) {
      // Auto-start timer if it was active
      setIsTimerActive(true);
      setLastUpdateTime(Date.now());
    }
  }, [gameStarted, gameFinished, showExplanation, isTimerActive, setIsTimerActive, setLastUpdateTime]);

  // Handle page refresh warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameStarted && !gameFinished && !showExplanation && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = 'Your quiz progress will be saved. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameStarted, gameFinished, showExplanation, timeLeft]);


  const currentAnsweredQuestion = answeredQuestions[currentQuestionIndex];

   useEffect(() => {
    if (gameStarted && !gameFinished) {
      // Check if current question has been answered
      const currentAnswered = answeredQuestions[currentQuestionIndex];
      if (currentAnswered) {
        // If question is answered, show explanation
        setShowExplanation(true);
        setIsCorrect(currentAnswered.correct);
        setUserAnswer('');
        setIsTimerActive(false);
      }
    }
  }, [gameStarted, gameFinished, answeredQuestions, currentQuestionIndex, 
      setShowExplanation, setIsCorrect, setUserAnswer, setIsTimerActive]);


  if (!gameStarted) {
    return <WelcomeScreen onStartGame={startGame} />;
  }

  if (gameFinished) {
    return (
      <ResultsScreen
        score={score}
        answeredQuestions={answeredQuestions}
        onRestart={restartQuiz}
      />
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return <div className="app-container"><div className="content-wrapper">Loading questions...</div></div>;
  }

  return (
    <QuizScreen
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      userAnswer={userAnswer}
      showExplanation={showExplanation}
      isCorrect={isCorrect}
      timeLeft={timeLeft}
      score={score}
      streak={streak}
      currentQuestion={currentQuestion}
       currentAnsweredQuestion={currentAnsweredQuestion}
      answeredQuestion={currentAnsweredQuestion}
      onAnswerChange={setUserAnswer}
      onSubmit={() => submitAnswer(false)}
      onNext={nextQuestion}
      onReset={resetGame}
    />
  );
};