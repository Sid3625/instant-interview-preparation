import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import QuizApp from "./QuizApp/quizzes/QuizApp";
import { McqQuizApp } from "./QuizApp/quizzes/QuizzesFormat/McqQuizApp";
import { CodeDebugQuizApp } from "./QuizApp/quizzes/QuizzesFormat/CodeDebugQuizApp";
import { GuessTheOutputQuizApp } from "./QuizApp/quizzes/QuizzesFormat/GuessTheOutputQuizApp";
import { ReactHookMasterApp } from "./QuizApp/quizzes/QuizzesFormat/ReactHookMasterApp";
import { JsAsyncQuizApp } from "./QuizApp/quizzes/QuizzesFormat/JsAsyncQuizApp";
const NotFound = lazy(() => import("./QuizApp/components/Screens/NotFound"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-white text-2xl font-semibold animate-pulse">
      Loading...
    </div>
  </div>
);

// Coming Soon component for unimplemented quizzes
const ComingSoon = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-teal-100 to-pink-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600">Coming Soon!</p>
      <a
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
      >
        Back to Selection
      </a>
    </div>
  </div>
);

// Create router with routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <QuizApp />,
  },
  {
    path: "/guess-output",
    element: <GuessTheOutputQuizApp />,
  },
  {
    path: "/mcq",
    element: <McqQuizApp />,
  },
  {
    path: "/debug",
    element: <CodeDebugQuizApp />,
  },
  {
    path: "/react-hooks",
    element: <ReactHookMasterApp />,
  },
  {
    path: "/async-js",
    element: <JsAsyncQuizApp />,
  },
  {
    path: "/algorithms",
    element: <ComingSoon title="Algorithm Sprint Quiz" />,
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
