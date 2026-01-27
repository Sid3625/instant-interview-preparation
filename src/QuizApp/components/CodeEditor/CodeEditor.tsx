import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import { useQuizStore } from "../../store/quizStore";
import { getFirstLineOfCode } from "../../utils/commonFunction";

export const CodeEditor = () => {
  const { userCode, setUserCode } = useQuizStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationIds = useRef<string[]>([]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: any
  ) => {
    editorRef.current = editor;

    // Apply read-only decorations to line 1
    applyReadOnlyDecorations(editor);

    // Override keyboard commands for line 1
    const disposable = editor.onKeyDown((e) => {
      const selection = editor.getSelection();
      if (selection && selection.startLineNumber === 1) {
        // Prevent most editing in line 1
        if (
          e.keyCode !== monacoInstance.KeyCode.Enter && // Allow Enter to move to next line
          e.keyCode !== monacoInstance.KeyCode.Escape && // Allow Escape
          e.keyCode !== monacoInstance.KeyCode.Tab && // Allow Tab (though it won't work in read-only area)
          e.keyCode !== monacoInstance.KeyCode.F1 // Allow function keys
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });

    // Move cursor to line 2 initially
    setTimeout(() => {
      editor.setPosition({ lineNumber: 2, column: 1 });
      editor.focus();
    }, 100);

    return () => disposable.dispose();
  };

  const applyReadOnlyDecorations = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    if (!editorRef.current) return;

    // Clear existing decorations
    if (decorationIds.current.length > 0) {
      editorRef.current.deltaDecorations(decorationIds.current, []);
      decorationIds.current = [];
    }

    // Add read-only decoration for line 1
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [
      {
        range: new monaco.Range(1, 1, 1, 1000), // Whole line 1
        options: {
          isWholeLine: true,
          className: "read-only-line",
          linesDecorationsClassName: "read-only-gutter",
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      },
    ];

    const ids = editor.deltaDecorations([], newDecorations);
    decorationIds.current = ids;
  };

  const handleEditorChange = (value: string | undefined) => {
    let code = value || "";

    // Always ensure the code ends with a closing brace and nothing after it
    const lines = code.split("\n");

    // Find the line with the last closing brace
    let lastBraceLine = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes("}")) {
        lastBraceLine = i;
        break;
      }
    }

    // If we found a closing brace, remove everything after that line
    if (lastBraceLine !== -1) {
      code = lines.slice(0, lastBraceLine + 1).join("\n");

      // Also ensure nothing comes after the closing brace on the same line
      const lastLine = lines[lastBraceLine];
      const braceIndex = lastLine.indexOf("}");
      if (braceIndex !== -1) {
        // Keep only up to and including the closing brace
        lines[lastBraceLine] = lastLine.substring(0, braceIndex + 1);
        code = lines.join("\n");
      }
    } else {
      // No closing brace found, add one
      code += "\n}";
    }

    // Ensure first line is correct
    const firstLine = getFirstLineOfCode(code) || "";
    const allLines = code.split("\n");
    allLines[0] = firstLine;
    code = allLines.join("\n");

    setUserCode(code);
  };

  return (
    <div style={{ position: "relative" }}>
      <Editor
        height="400px"
        language="javascript"
        theme="vs-dark"
        value={userCode}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
      <style>{`
        .read-only-line {
          background-color: rgba(128, 128, 128, 0.1);
          color: #888 !important;
        }
        .read-only-gutter {
          background-color: rgba(128, 128, 128, 0.2);
          width: 3px !important;
          margin-left: 5px;
        }
      `}</style>
    </div>
  );
};
