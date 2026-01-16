import { useState } from "react";
import { QuizSelectionPage } from "./QuizSelectionPage";
import { McqQuizApp } from "./QuizzesFormat/McqQuizApp";
import { CodeDebugQuizApp } from "./QuizzesFormat/CodeDebugQuizApp";
import { JsQuizApp } from "./QuizzesFormat/JsQuizApp";

 export default function QuizApp() {

 const [currentView, setCurrentView] = useState<'selection' | 'mcq' | 'debug' | 'guessOutput'>('selection');
  if (currentView === 'guessOutput') {
    return <JsQuizApp/>;
  }

  if (currentView === 'mcq') {
    return <McqQuizApp />;
  }

  if (currentView === 'debug') {
    return <CodeDebugQuizApp />;
  }

  return <QuizSelectionPage onSelectQuiz={(id) => {
    if (id === 'guess-output') setCurrentView('guessOutput');
    else if (id === 'mcq-quiz') setCurrentView('mcq');
    else if (id === 'code-debug') setCurrentView('debug');
    else alert(`${id} quiz template coming soon!`);
  }} />;
}