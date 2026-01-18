import { useCallback } from "react";
import { useQuizStore } from "../../store/quizStore";
import { CodeEditor } from "../CodeEditor/CodeEditor";
import { OutputPanel } from "../CodeEditor/Output";
import { RunButton } from "../CodeEditor/RunButton";
import { useTimerEffect } from "../../hooks/useTimer";
import type { Question } from "../../types/types";

interface MachineCodingQuestionProps {
  question: Question;
}

export const MachineCodingQuestion: React.FC<MachineCodingQuestionProps> = ({
  question,
}) => {
  const {
    showExplanation,
    isCorrect,
    submitMachineCodingAnswer,
    nextQuestion,
    isCurrentQuestionAnswered,
    streak,
    timeLeft,
  } = useQuizStore();
  // Handle timer timeout
  const handleTimeout = useCallback(() => {
    if (!showExplanation && question) {
      submitMachineCodingAnswer(question, true);
    }
  }, [showExplanation, question, timeLeft, streak, submitMachineCodingAnswer]);

  // Timer effect
  useTimerEffect(handleTimeout);

  const alreadyAnswered = isCurrentQuestionAnswered();

  return (
    <div className="space-y-6">
      {/* Problem Statement */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Problem</h2>
        <p className="text-gray-700 whitespace-pre-line">{question.prompt}</p>
      </div>

      {/* Code Editor */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-medium mb-2">Code Editor</h3>
        <CodeEditor />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <RunButton />
        {!alreadyAnswered && (
          <button
            onClick={() => submitMachineCodingAnswer(question)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Solution
          </button>
        )}

        {alreadyAnswered && (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Output */}
      <OutputPanel />

      {/* Explanation */}
      {showExplanation && (
        <div
          className={`rounded-lg p-4 ${
            isCorrect ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h3 className="font-semibold mb-2">
            {isCorrect ? "✅ Correct" : "❌ Incorrect"}
          </h3>

          <p className="text-gray-700 whitespace-pre-line">
            {question.explanation}
          </p>

          {question.hints?.length > 0 && (
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              {question.hints.map((hint: string, i: number) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
