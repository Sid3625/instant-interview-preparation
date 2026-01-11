import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Timer, Code, Trophy, Zap, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import questionsData from './data/data.json';


// Types
interface Question {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  code: string;
  correctAnswer: string;
  explanation: string;
  hints: string[];
  type: 'text' | 'mcq';
  options?: string[];
}

interface AnsweredQuestion {
  question: Question;
  userAnswer: string;
  correct: boolean;
  points: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | null;

// Custom Hooks
const useTimer = (initialTime: number, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const start = () => setIsActive(true);
  const reset = (time: number) => {
    setTimeLeft(time);
    setIsActive(false);
  };

  return { timeLeft, isActive, start, reset };
};

const useScore = () => {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const addScore = (points: number, isCorrect: boolean) => {
    setScore(prev => Math.max(0, prev + points));
    setStreak(prev => isCorrect ? prev + 1 : 0);
  };

  const reset = () => {
    setScore(0);
    setStreak(0);
  };

  return { score, streak, addScore, reset };
};

// Components
const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="code-block">
    <pre>
      <code>{code}</code>
    </pre>
  </div>
);

const TimerDisplay: React.FC<{ timeLeft: number; totalTime: number }> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="timer-display">
      <Timer className={`timer-display__icon ${isLow ? 'timer-display__icon--low' : ''}`} />
      <div className="timer-display__bar">
        <div
          className={`timer-display__progress ${isLow ? 'timer-display__progress--low' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`timer-display__text ${isLow ? 'timer-display__text--low' : ''}`}>
        {timeLeft}s
      </span>
    </div>
  );
};

const Explanation: React.FC<{ question: Question; userAnswer: string; isCorrect: boolean }> = ({
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

// Main Component
const GuessTheOutputQuiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);

  const { score, streak, addScore, reset: resetScore } = useScore();
  const TIMER_DURATION = 45;

 const handleSubmit = (isTimeout = false) => {
  if (!currentQuestion) return;

  const correct = normalizeAnswer(userAnswer) === normalizeAnswer(currentQuestion.correctAnswer);
  setIsCorrect(correct);
  setShowExplanation(true);

  let points = 0;
  if (correct) {
    const timeBonus = !isTimeout && timeLeft > 30 ? 5 : 0;
    points = 10 + timeBonus + (streak * 2);
  } else {
    points = isTimeout ? -10 : -5;
  }

  addScore(points, correct);
  setAnsweredQuestions(prev => [...prev, {
    question: currentQuestion,
    userAnswer: isTimeout ? '(timeout - no answer)' : userAnswer,
    correct,
    points
  }]);
};
const handleTimeout = useCallback(() => {
  if (!showExplanation) {
    handleSubmit(true);
  }
}, [showExplanation, handleSubmit]);

const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(TIMER_DURATION, handleTimeout);

const questions = useMemo<Question[]>(() => {
  if (!gameStarted) return [];

  const sourceQuestions = questionsData.questions as Question[];

  const filtered = difficulty
    ? sourceQuestions.filter(q => q.difficulty === difficulty)
    : sourceQuestions;

  return [...filtered].sort(() => Math.random() - 0.5);
  
}, [gameStarted, difficulty]);

 

  const currentQuestion = questions[currentQuestionIndex];


  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    resetScore();
    setAnsweredQuestions([]);
    resetTimer(TIMER_DURATION);
    startTimer();
  };

  const normalizeAnswer = (answer: string): string => {
    return answer.trim().toLowerCase().replace(/\s+/g, ' ');
  };


  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowExplanation(false);
      resetTimer(TIMER_DURATION);
      startTimer();
    } else {
      setGameFinished(true);
    }
  };

  const restartQuiz = () => {
 
    setDifficulty(null);
    setGameStarted(false);
    setGameFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowExplanation(false);
    resetScore();
    setAnsweredQuestions([]);
  };

  // Welcome Screen
  if (!gameStarted) {
    return (
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
            <div className="difficulty-grid">
              <button onClick={() => startGame('easy')} className="difficulty-btn difficulty-btn--easy">
                <div className="difficulty-btn__emoji">🟢</div>
                <h3 className="difficulty-btn__title">Easy</h3>
                <p className="difficulty-btn__description">Basics, hoisting, map/filter</p>
              </button>
              <button onClick={() => startGame('medium')} className="difficulty-btn difficulty-btn--medium">
                <div className="difficulty-btn__emoji">🟡</div>
                <h3 className="difficulty-btn__title">Medium</h3>
                <p className="difficulty-btn__description">Closures, async/await, hooks</p>
              </button>
              <button onClick={() => startGame('hard')} className="difficulty-btn difficulty-btn--hard">
                <div className="difficulty-btn__emoji">🔴</div>
                <h3 className="difficulty-btn__title">Hard</h3>
                <p className="difficulty-btn__description">Event loop, stale closures, memoization</p>
              </button>
              <button onClick={() => startGame(null)} className="difficulty-btn difficulty-btn--all">
                <div className="difficulty-btn__emoji">🌈</div>
                <h3 className="difficulty-btn__title">All Levels</h3>
                <p className="difficulty-btn__description">Mixed difficulty challenge</p>
              </button>
            </div>
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
  }

  // Results Screen
  if (gameFinished) {
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

            <button onClick={restartQuiz} className="btn btn--primary btn--large btn--block">
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

    
  // Don't render if questions aren't loaded yet
  if (gameStarted && questions.length === 0) {
    return <div className="app-container"><div className="content-wrapper">Loading...</div></div>;
  }
  
  // Safety check for current question
  if (gameStarted && !currentQuestion) {
    return <div className="app-container"><div className="content-wrapper">Loading question...</div></div>;
  }

  // Quiz Screen
  return (
    <div className="app-container app-container--quiz">
      <div className="content-wrapper">
        <div className="card stats-header">
          <div className="stat-item">
            <div className="stat-item__value stat-item__value--primary">{score}</div>
            <div className="stat-item__label">Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value">{currentQuestionIndex + 1}/{questions.length}</div>
            <div className="stat-item__label">Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value stat-item__value--streak">🔥 {streak}</div>
            <div className="stat-item__label">Streak</div>
          </div>
        </div>

        <div className="card question-card">
          <div className="question-header">
            <div className="tags">
              <span className={`badge badge--${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <h2 className="tags__topic">Topic: {currentQuestion.topic}</h2>
            </div>
          </div>

          {!showExplanation && (
            <TimerDisplay timeLeft={timeLeft} totalTime={TIMER_DURATION} />
          )}

          <h3 className="question-card__title">What will be the output?</h3>
          <CodeBlock code={currentQuestion.code} />

          {showExplanation ? (
            <>
              <Explanation
                question={currentQuestion}
                userAnswer={userAnswer}
                isCorrect={isCorrect}
              />
              <button onClick={handleNext} className="btn btn--primary btn--block">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            </>
          ) : (
            <>
              {currentQuestion.type === 'mcq' ? (
                <div className="mcq-section">
                  <label className="mcq-section__label">Choose the correct answer:</label>
                  <div className="mcq-options">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
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
                    onChange={(e) => setUserAnswer(e.target.value)}
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
                onClick={() => handleSubmit(false)}
                disabled={!userAnswer.trim()}
                className="btn btn--primary btn--block"
              >
                Submit Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessTheOutputQuiz;