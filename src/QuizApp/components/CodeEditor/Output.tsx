import { useQuizStore } from "../../store/quizStore";

export const OutputPanel = () => {
  const { runOutput, compileError } = useQuizStore();

  return (
    <div className="bg-black text-green-400 p-4 rounded h-32 overflow-auto">
      {compileError ? (
        <span className="text-red-400">{compileError}</span>
      ) : (
        runOutput || "Output will appear here..."
      )}
    </div>
  );
};
