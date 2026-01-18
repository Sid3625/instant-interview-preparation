import Editor from "@monaco-editor/react";
import { useQuizStore } from "../../store/quizStore";

export const CodeEditor = () => {
  const { userCode, setUserCode } = useQuizStore();

  return (
    <Editor
      height="400px"
      language="javascript"
      theme="vs-dark"
      value={userCode}
      onChange={(value) => setUserCode(value || "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
};
