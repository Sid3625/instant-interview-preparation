import { ArrowRight, Home } from "lucide-react";
import { useQuizStore } from "../../store/quizStore";
import { useEffect, useState } from "react";

interface MCQQuestion {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface AnsweredMCQQuestion {
  question: MCQQuestion;
  userAnswer: string;
  correct: boolean;
  points: number;
}

export const McqQuizApp: React.FC = () => {
  const {
    currentQuestionIndex,
    showExplanation,
    score,
    gameStarted,
    gameFinished,
    userAnswer,
    setUserAnswer,
    setShowExplanation,
    setIsCorrect,
    setCurrentQuestionIndex,
    setScore,
    restartQuiz,
    setGameStarted,
    setGameFinished,
  } = useQuizStore();

  // Local state for MCQ-specific answered questions
  const [answeredMCQQuestions, setAnsweredMCQQuestions] = useState<AnsweredMCQQuestion[]>([]);

  const sampleQuestions: MCQQuestion[] = [
    {
      id: 1,
      difficulty: "medium",
      topic: "Closures",
      question: "What is a closure in JavaScript?",
      options: [
        "A function that has access to variables in its outer scope",
        "A way to close a function",
        "A type of loop",
        "A method to hide variables",
      ],
      correctAnswer:
        "A function that has access to variables in its outer scope",
      explanation:
        "A closure is created when a function retains access to variables from its outer (enclosing) scope, even after the outer function has finished executing.",
    },
    {
      id: 2,
      difficulty: "easy",
      topic: "Data Types",
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: ["String", "Number", "Object", "Boolean"],
      correctAnswer: "Object",
      explanation:
        "Object is not a primitive data type. The primitive types in JavaScript are: string, number, bigint, boolean, undefined, symbol, and null.",
    },
    {
      id: 3,
      difficulty: "hard",
      topic: "Promises",
      question: "What will Promise.all() return if one promise rejects?",
      options: [
        "It will wait for all promises to settle",
        "It will immediately reject with that error",
        "It will return the successful promises",
        "It will return undefined",
      ],
      correctAnswer: "It will immediately reject with that error",
      explanation:
        "Promise.all() short-circuits and immediately rejects if any of the promises reject, without waiting for other promises to complete.",
    },
  ];

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  useEffect(() => {
    // Start game on mount if not already started
    if (!gameStarted && !gameFinished) {
      setGameStarted(true);
    }
  }, [gameStarted, gameFinished, setGameStarted]);

  const handleSubmit = () => {
    if (!userAnswer || !currentQuestion) return;

    // Check if answer is correct
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    const points = isCorrect ? 10 : 0;

    const answeredQuestion: AnsweredMCQQuestion = {
      question: currentQuestion,
      userAnswer: userAnswer,
      correct: isCorrect,
      points,
    };

    // Update local state
    setAnsweredMCQQuestions([...answeredMCQQuestions, answeredQuestion]);
    setScore(score + points);
    setShowExplanation(true);
    setIsCorrect(isCorrect);
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowExplanation(false);
    } else {
      setGameFinished(true);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    restartQuiz();
    setAnsweredMCQQuestions([]);
    setGameStarted(true);
  };

  // Results Screen
  if (gameFinished) {
    const percentage = Math.round((score / (sampleQuestions.length * 10)) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-4">Quiz Complete! 🎉</h1>
            <div className="text-6xl font-bold text-gray-800 mb-2">{score}</div>
            <div className="text-xl text-gray-600 mb-6">
              Score: {percentage}% ({answeredMCQQuestions.filter(q => q.correct).length}/{sampleQuestions.length} correct)
            </div>
          </div>

          {/* Results Summary */}
          <div className="space-y-3 mb-8">
            {answeredMCQQuestions.map((aq, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${aq.correct
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">
                      Q{idx + 1}: {aq.question.question}
                    </div>
                    <div className="text-sm text-gray-600">
                      Your answer: <strong>{aq.userAnswer}</strong>
                    </div>
                    {!aq.correct && (
                      <div className="text-sm text-gray-600">
                        Correct answer: <strong>{aq.question.correctAnswer}</strong>
                      </div>
                    )}
                  </div>
                  <div
                    className={`font-bold ${aq.correct ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {aq.correct ? "✓" : "✗"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-all"
            >
              <Home size={18} />
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1}/{sampleQuestions.length}
          </span>
          <span className="text-xl font-bold text-purple-600">
            Score: {score}
          </span>
        </div>

        {/* Difficulty Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4
            ${currentQuestion.difficulty === "easy"
              ? "bg-green-100 text-green-700"
              : currentQuestion.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {currentQuestion.difficulty.toUpperCase()}
        </span>

        {/* Topic */}
        <div className="text-sm text-purple-600 mb-2">
          Topic: <strong>{currentQuestion.topic}</strong>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options / Explanation */}
        {!showExplanation ? (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const selected = userAnswer === option;

              return (
                <button
                  key={idx}
                  onClick={() => setUserAnswer(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all
                    ${selected
                      ? "border-purple-400 bg-purple-50 text-purple-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${selected
                          ? "border-purple-500"
                          : "border-gray-400"
                        }`}
                    >
                      {selected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className={`p-6 rounded-xl mb-6 border
              ${userAnswer === currentQuestion.correctAnswer
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
              }`}
          >
            <h3
              className={`font-bold mb-2
                ${userAnswer === currentQuestion.correctAnswer
                  ? "text-green-700"
                  : "text-red-700"
                }`}
            >
              {userAnswer === currentQuestion.correctAnswer
                ? "Correct! ✓"
                : "Incorrect ✗"}
            </h3>

            {userAnswer !== currentQuestion.correctAnswer && (
              <p className="text-sm text-gray-700 mb-2">
                Correct answer:{" "}
                <strong>{currentQuestion.correctAnswer}</strong>
              </p>
            )}

            <p className="text-sm text-gray-700">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold
                       transition-all shadow-md flex items-center justify-center gap-2"
          >
            {currentQuestionIndex === sampleQuestions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
