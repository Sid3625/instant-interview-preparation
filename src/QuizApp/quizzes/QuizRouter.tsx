// import { useState } from 'react';
// import { AVAILABLE_QUIZZES } from '../config/quizzes.config';
// import MCQQuiz from './MCQQuiz/MCQQuiz';
// import CodeDebugQuiz from './CodeDebug/CodeDebugQuiz';
// import { JsQuizApp } from './JsQuizApp';

// export const QuizRouter = () => {
//   const [activeQuiz, setActiveQuiz] = useState(null);

//   const renderQuiz = () => {
//     switch (activeQuiz) {
//       case 'guess-output':
//         return <JsQuizApp onExit={() => setActiveQuiz(null)} />;
//       case 'mcq':
//         return <MCQQuiz onExit={() => setActiveQuiz(null)} />;
//       case 'code-debug':
//         return <CodeDebugQuiz onExit={() => setActiveQuiz(null)} />;
//       default:
//         return ;
//     }
//   };

//   return {renderQuiz()};
// };