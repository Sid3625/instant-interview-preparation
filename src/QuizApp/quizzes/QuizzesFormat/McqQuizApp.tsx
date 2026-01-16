import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface MCQQuestion {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const McqQuizApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

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
  ];

  const currentQuestion = sampleQuestions[currentIndex];

  const handleSubmit = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 10);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">
            Question {currentIndex + 1}/10
          </span>
          <span className="text-xl font-bold text-purple-600">
            Score: {score}
          </span>
        </div>

        {/* Difficulty Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4
            ${
              currentQuestion.difficulty === "easy"
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
              const selected = selectedAnswer === option;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all
                    ${
                      selected
                        ? "border-purple-400 bg-purple-50 text-purple-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          selected
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
              ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
          >
            <h3
              className={`font-bold mb-2
                ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "text-green-700"
                    : "text-red-700"
                }`}
            >
              {selectedAnswer === currentQuestion.correctAnswer
                ? "Correct!"
                : "Incorrect"}
            </h3>

            {selectedAnswer !== currentQuestion.correctAnswer && (
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
            disabled={!selectedAnswer}
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
            Next Question <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
