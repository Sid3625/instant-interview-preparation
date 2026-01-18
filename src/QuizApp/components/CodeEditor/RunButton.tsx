import { useQuizStore } from "../../store/quizStore";
import { runUserCode } from "./runUserCode";

export const RunButton = () => {
  const { userCode, setRunOutput, setCompileError, setIsRunning } =
    useQuizStore();

  const run = () => {
    setIsRunning(true);
    setCompileError(null);
    setRunOutput("");
    const wrappedCode = `
        ${userCode}

        try {
        if (typeof solution !== "function") {
            console.log("❌ Error: solution(a, b) is not defined");
        } else {
            console.log("Running test cases...");

            console.log("Test 1:", solution(1, 2) === 3 ? "PASS" : "FAIL");
            console.log("Test 2:", solution(-5, 5) === 0 ? "PASS" : "FAIL");
        }
        } catch (e) {
        console.log("Runtime Error:", e.message);
        }
    `;

    runUserCode(
      wrappedCode,
      (output) => setRunOutput(output),
      (error) => setCompileError(error)
    );

    setIsRunning(false);
  };

  return (
    <button
      onClick={run}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      ▶ Run Code
    </button>
  );
};
