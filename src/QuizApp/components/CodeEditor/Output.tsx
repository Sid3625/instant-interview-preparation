import { useQuizStore } from "../../store/quizStore";

export const OutputPanel = () => {
  const { runOutput, compileError } = useQuizStore();

  return (
    <div className="bg-black text-green-400 p-4 rounded h-32 overflow-auto">
      {compileError ? (
        <span className="text-red-400">{compileError}</span>
      ) : (
        <pre className="whitespace-pre-wrap text-sm">
          {runOutput || "Output will appear here..."}
        </pre>
      )}
    </div>
  );
};
