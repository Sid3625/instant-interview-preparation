import { useQuizStore } from "../../store/quizStore";
import { extractFunctionName } from "../../utils/commonFunction";
import { runUserCode } from "./runUserCode";

export const RunButton = () => {
  const {
    userCode,
    questions,
    currentQuestionIndex,
    setRunOutput,
    setCompileError,
    setIsRunning,
  } = useQuizStore();

  const run = () => {
    if (!questions[currentQuestionIndex].testCases) return;

    setIsRunning(true);
    setCompileError(null);
    setRunOutput("");

    const testCases = JSON.stringify(questions[currentQuestionIndex].testCases);
    const functionName = extractFunctionName(
      questions[currentQuestionIndex].starterCode
    );

    if (!functionName) {
      setCompileError("Unable to detect function name");
      return;
    }

    const wrappedCode = `
  ${userCode}

  const testCases = ${testCases};
  const functionName = "${functionName}";

  (async function runTests() {
    try {
      const fn = globalThis[functionName];

    
      if (typeof fn !== "function") {
        console.log(\`❌ Error: \${functionName} is not defined\`);
        return;
      }

      console.log("Running test cases...");

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];

        let result = fn(...tc.input);

        if (result instanceof Promise) {
          result = await result;
        }

        const pass =
          JSON.stringify(result) === JSON.stringify(tc.expectedOutput);

        console.log(
          \`Test \${i + 1} (\${tc.name}): \${pass ? "PASS" : "FAIL"}\`,
          pass
            ? ""
            : JSON.stringify({
                expected: tc.expectedOutput,
                received: result,
              })
        );
      }
    } catch (e) {
      console.log("Runtime Error:", e.message);
    }
  })();
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
