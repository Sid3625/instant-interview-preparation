import { useState } from "react";
import { QuizSelectionPage } from "./QuizSelectionPage";
import { McqQuizApp } from "./QuizzesFormat/McqQuizApp";
import { CodeDebugQuizApp } from "./QuizzesFormat/CodeDebugQuizApp";
import { JsQuizApp } from "./QuizzesFormat/JsQuizApp";
import { ReactHookMasterApp } from "./QuizzesFormat/ReactHookMasterApp";

export default function QuizApp() {
  const [currentView, setCurrentView] = useState<
    "selection" | "mcq" | "debug" | "guessOutput" | "react-hooks"
  >("selection");
  if (currentView === "guessOutput") {
    return <JsQuizApp />;
  }

  if (currentView === "mcq") {
    return <McqQuizApp />;
  }

  if (currentView === "debug") {
    return <CodeDebugQuizApp />;
  }

  if (currentView === "react-hooks") {
    return <ReactHookMasterApp />;
  }

  return (
    <QuizSelectionPage
      onSelectQuiz={(id) => {
        if (id === "guess-output") setCurrentView("guessOutput");
        else if (id === "mcq-quiz") setCurrentView("mcq");
        else if (id === "code-debug") setCurrentView("debug");
        else if (id === "react-hooks") setCurrentView("react-hooks");
        else alert(`${id} quiz template coming soon!`);
      }}
    />
  );
}
