import { create } from "zustand";
import type {
  Question,
  AnsweredQuestion,
  Difficulty,
  QuizData,
  TestCase,
} from "../types/types";
import { TIMER_DURATION } from "../utils/constant";
import {
  deepEqual,
  extractFunctionName,
  normalizeInput,
} from "../utils/commonFunction";

interface QuizStore {
  difficulty: Difficulty;
  currentQuestionIndex: number;
  userAnswer: string;
  showExplanation: boolean;
  isCorrect: boolean;
  gameStarted: boolean;
  gameFinished: boolean;
  answeredQuestions: AnsweredQuestion[];

  // Score state
  score: number;
  streak: number;

  // Timer state
  timeLeft: number;
  isTimerActive: boolean;
  lastUpdateTime: number | null;
  timerDuration: number;

  // Actions
  setDifficulty: (difficulty: Difficulty) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (answer: string) => void;
  setShowExplanation: (show: boolean) => void;
  setIsCorrect: (correct: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setGameFinished: (finished: boolean) => void;
  setAnsweredQuestions: (questions: AnsweredQuestion[]) => void;
  addAnsweredQuestion: (question: AnsweredQuestion) => void;

  // Score actions
  setScore: (score: number) => void;
  setStreak: (streak: number) => void;
  addScore: (points: number, isCorrect: boolean) => void;

  // Timer actions
  setTimeLeft: (time: number) => void;
  setIsTimerActive: (active: boolean) => void;
  setLastUpdateTime: (time: number | null) => void;
  resetTimer: (initialTime: number) => void;

  startGame: (
    difficulty: Difficulty,
    quizData: QuizData,
    questionTimer: number
  ) => void;
  submitAnswer: (params: {
    question: Question;
    userAnswer: string;
    isTimeout?: boolean;
    timeLeft: number;
    streak: number;
  }) => void;

  submitMachineCodingAnswer: (question: Question, isTimeout?: boolean) => void;

  nextQuestion: () => void;
  restartQuiz: () => void;
  resetGame: () => void;

  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  isCurrentQuestionAnswered: () => boolean;
  restoreState: () => void;
  resumeTimer: () => number;
  userCode: string;
  runOutput: string;
  compileError: string | null;
  isRunning: boolean;
  setUserCode: (code: string) => void;
  setRunOutput: (output: string) => void;
  setCompileError: (error: string | null) => void;
  setIsRunning: (running: boolean) => void;
  setTimerDuration: (duration: number) => void;
}
export const useQuizStore = create<QuizStore>()((set, get) => ({
  // Initial state
  difficulty: null,
  currentQuestionIndex: 0,
  userAnswer: "",
  showExplanation: false,
  isCorrect: false,
  gameStarted: false,
  gameFinished: false,
  answeredQuestions: [],
  score: 0,
  streak: 0,
  timeLeft: TIMER_DURATION,
  isTimerActive: false,
  lastUpdateTime: null,
  questions: [],
  timerDuration: TIMER_DURATION,
  userCode: "",
  runOutput: "",
  compileError: null as string | null,
  isRunning: false,

  // Actions

  setUserCode: (code: string) => set({ userCode: code }),
  setRunOutput: (output: string) => set({ runOutput: output }),
  setCompileError: (error: string | null) => set({ compileError: error }),
  setIsRunning: (running: boolean) => set({ isRunning: running }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setUserAnswer: (answer) => set({ userAnswer: answer }),
  setShowExplanation: (show) => set({ showExplanation: show }),
  setIsCorrect: (correct) => set({ isCorrect: correct }),
  setGameStarted: (started) => set({ gameStarted: started }),
  setGameFinished: (finished) => set({ gameFinished: finished }),
  setAnsweredQuestions: (questions) => set({ answeredQuestions: questions }),
  setTimerDuration: (duration: number) =>
    set({
      timerDuration: duration,
    }),
  addAnsweredQuestion: (question) =>
    set((state) => ({
      answeredQuestions: [...state.answeredQuestions, question],
    })),

  setScore: (score) => set({ score }),
  setStreak: (streak) => set({ streak }),
  addScore: (points, isCorrect) =>
    set((state) => ({
      score: Math.max(0, state.score + points),
      streak: isCorrect ? state.streak + 1 : 0,
    })),

  setTimeLeft: (time) => set({ timeLeft: time }),
  setIsTimerActive: (active) => set({ isTimerActive: active }),
  setLastUpdateTime: (time) => set({ lastUpdateTime: time }),
  resetTimer: (initialTime) =>
    set({
      timeLeft: initialTime,
      isTimerActive: false,
      lastUpdateTime: null,
    }),

  setQuestions: (questions) => set({ questions }),

  resumeTimer: () => {
    const state = get();
    if (
      !state.lastUpdateTime ||
      !state.isTimerActive ||
      state.showExplanation
    ) {
      return state.timeLeft;
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastUpdateTime) / 1000);
    const newTimeLeft = Math.max(0, state.timeLeft - elapsedSeconds);

    set({
      timeLeft: newTimeLeft,
      lastUpdateTime: now,
    });

    return newTimeLeft;
  },

  startGame: (difficulty, quizData, questionTimer) => {
    const sourceQuestions = quizData.questions as Question[];

    // filter by difficulty
    const filtered = difficulty
      ? sourceQuestions.filter((q) => q.difficulty === difficulty)
      : sourceQuestions;

    // shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    const firstQuestion = shuffled[0];

    set({
      difficulty,
      questions: shuffled,
      currentQuestionIndex: 0,
      userAnswer: "",
      showExplanation: false,
      isCorrect: false,
      gameStarted: true,
      gameFinished: false,
      answeredQuestions: [],
      score: 0,
      streak: 0,
      timeLeft: questionTimer,
      isTimerActive: true,
      lastUpdateTime: Date.now(),
      // machine coding
      userCode: firstQuestion?.starterCode || "",
      runOutput: "",
      compileError: null,
      isRunning: false,
    });
  },

  isCurrentQuestionAnswered: () => {
    const state = get();
    const currentQuestion = state.questions[state.currentQuestionIndex];

    return state.answeredQuestions.some(
      (aq) => aq.question.id === currentQuestion?.id
    );
  },

  restoreState: () => get(),

  submitAnswer: ({
    question,
    userAnswer,
    isTimeout = false,
    timeLeft,
    streak,
  }) => {
    if (question.type === "machine-coding") return;
    const normalizeAnswer = (answer: string): string =>
      answer.trim().toLowerCase().replace(/\s+/g, " ");
    if (!question.correctAnswer) return;
    const correct =
      normalizeAnswer(userAnswer) === normalizeAnswer(question.correctAnswer);

    let points = 0;
    if (correct) {
      const timeBonus = !isTimeout && timeLeft > 30 ? 5 : 0;
      points = 10 + timeBonus + streak * 2;
    } else {
      points = isTimeout ? -10 : -5;
    }

    const answeredQuestion = {
      question,
      userAnswer: isTimeout ? "(timeout - no answer)" : userAnswer,
      correct,
      points,
    };

    set((state) => ({
      userAnswer: "",
      showExplanation: true,
      isCorrect: correct,
      answeredQuestions: [...state.answeredQuestions, answeredQuestion],
      score: Math.max(0, state.score + points),
      streak: correct ? state.streak + 1 : 0,
      isTimerActive: false,
      lastUpdateTime: null,
    }));
  },

  submitMachineCodingAnswer: async (question: Question, isTimeout = false) => {
    const { userCode, streak } = get();
    let passed = false;
    console.log(isTimeout);

    try {
      const functionName = extractFunctionName(question.starterCode);

      if (!functionName) {
        throw new Error("Unable to detect function name");
      }

      const fn = new Function(`
        ${userCode}
        return typeof ${functionName} === "function"
          ? ${functionName}
          : undefined;
      `)();

      if (typeof fn !== "function") {
        throw new Error(`${functionName} is not defined`);
      }

      switch (question.evaluationType) {
        case "conceptual":
          passed = true;
          break;

        case "behavioral": {
          const result = fn(...(question.testCases?.[0]?.input ?? []));
          passed = typeof result === "function";
          break;
        }

        case "async":
        case "sync":
        default: {
          const results = await Promise.all(
            question.testCases?.map(async (tc: TestCase) => {
              const input = normalizeInput(question, tc);

              let output = fn(...input);
              if (output instanceof Promise) {
                output = await output;
              }

              return deepEqual(output, tc.expectedOutput);
            }) ?? []
          );

          passed = results.every(Boolean);
        }
      }
    } catch (err: any) {
      passed = false;
      console.log("Execution failed:", err.message);
    }

    const points = passed ? 30 + streak * 5 : -10;

    const answeredQuestion = {
      question,
      userAnswer: userCode,
      correct: passed,
      points,
    };

    set((state) => ({
      showExplanation: true,
      isCorrect: passed,
      answeredQuestions: [...state.answeredQuestions, answeredQuestion],
      score: Math.max(0, state.score + points),
      streak: passed ? state.streak + 1 : 0,
      isTimerActive: false,
      lastUpdateTime: null,
    }));
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex < state.questions.length - 1) {
      set({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        userAnswer: "",
        showExplanation: false,
        isCorrect: false,
        timeLeft: state.timerDuration,
        isTimerActive: true,
        lastUpdateTime: Date.now(),
        userCode:
          state.questions[state.currentQuestionIndex + 1]?.starterCode || "",
        runOutput: "",
        compileError: null,
        isRunning: false,
      });
    } else {
      set({
        gameFinished: true,
        isTimerActive: false,
        lastUpdateTime: null,
        showExplanation: false,
      });
    }
  },

  restartQuiz: () => {
    set({
      difficulty: null,
      currentQuestionIndex: 0,
      userAnswer: "",
      showExplanation: false,
      isCorrect: false,
      gameStarted: false,
      gameFinished: false,
      answeredQuestions: [],
      score: 0,
      streak: 0,
      timeLeft: TIMER_DURATION,
      isTimerActive: false,
      lastUpdateTime: null,
      questions: [],
      userCode: "",
      runOutput: "",
      compileError: null as string | null,
      isRunning: false,
    });
  },

  resetGame: () => {
    set({
      currentQuestionIndex: 0,
      userAnswer: "",
      showExplanation: false,
      isCorrect: false,
      gameFinished: false,
      answeredQuestions: [],
      score: 0,
      streak: 0,
      timeLeft: TIMER_DURATION,
      isTimerActive: false,
      lastUpdateTime: null,
      questions: [],
      userCode: "",
      runOutput: "",
      compileError: null as string | null,
      isRunning: false,
    });
  },
}));
// local storage code
// export const useQuizStore = create<QuizStore>()(
//   persist(
//     (set, get) => ({
//       // Initial state
//       difficulty: null,
//       currentQuestionIndex: 0,
//       userAnswer: "",
//       showExplanation: false,
//       isCorrect: false,
//       gameStarted: false,
//       gameFinished: false,
//       answeredQuestions: [],
//       score: 0,
//       streak: 0,
//       timeLeft: TIMER_DURATION,
//       isTimerActive: false,
//       lastUpdateTime: null,
//       questions: [],
//       timerDuration: TIMER_DURATION,

//       // Actions
//       setDifficulty: (difficulty) => set({ difficulty }),
//       setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
//       setUserAnswer: (answer) => set({ userAnswer: answer }),
//       setShowExplanation: (show) => set({ showExplanation: show }),
//       setIsCorrect: (correct) => set({ isCorrect: correct }),
//       setGameStarted: (started) => set({ gameStarted: started }),
//       setGameFinished: (finished) => set({ gameFinished: finished }),
//       setAnsweredQuestions: (questions) =>
//         set({ answeredQuestions: questions }),
//       addAnsweredQuestion: (question) =>
//         set((state) => ({
//           answeredQuestions: [...state.answeredQuestions, question],
//         })),

//       setScore: (score) => set({ score }),
//       setStreak: (streak) => set({ streak }),
//       addScore: (points, isCorrect) =>
//         set((state) => ({
//           score: Math.max(0, state.score + points),
//           streak: isCorrect ? state.streak + 1 : 0,
//         })),

//       setTimeLeft: (time) => set({ timeLeft: time }),
//       setIsTimerActive: (active) => set({ isTimerActive: active }),
//       setLastUpdateTime: (time) => set({ lastUpdateTime: time }),
//       resetTimer: (initialTime) =>
//         set({
//           timeLeft: initialTime,
//           isTimerActive: false,
//           lastUpdateTime: null,
//         }),

//       setQuestions: (questions) => set({ questions }),

//       resumeTimer: () => {
//         const state = get();
//         if (
//           !state.lastUpdateTime ||
//           !state.isTimerActive ||
//           state.showExplanation
//         ) {
//           return state.timeLeft;
//         }

//         const now = Date.now();
//         const elapsedSeconds = Math.floor((now - state.lastUpdateTime) / 1000);
//         const newTimeLeft = Math.max(0, state.timeLeft - elapsedSeconds);

//         set({
//           timeLeft: newTimeLeft,
//           lastUpdateTime: now,
//         });

//         return newTimeLeft;
//       },

//       startGame: (difficulty) => {
//         set({
//           difficulty,
//           currentQuestionIndex: 0,
//           userAnswer: "",
//           showExplanation: false,
//           isCorrect: false,
//           gameStarted: true,
//           gameFinished: false,
//           answeredQuestions: [],
//           score: 0,
//           streak: 0,
//           timeLeft: TIMER_DURATION,
//           isTimerActive: true,
//           lastUpdateTime: Date.now(),
//         });
//       },

//       isCurrentQuestionAnswered: () => {
//         const state = get();
//         return state.answeredQuestions.some(
//           (_, index) => index === state.currentQuestionIndex
//         );
//       },

//       restoreState: () => {
//         return get();
//       },

//       submitAnswer: ({
//         question,
//         userAnswer,
//         isTimeout = false,
//         timeLeft,
//         streak,
//       }) => {
//         const normalizeAnswer = (answer: string): string => {
//           return answer.trim().toLowerCase().replace(/\s+/g, " ");
//         };

//         const correct =
//           normalizeAnswer(userAnswer) ===
//           normalizeAnswer(question.correctAnswer);

//         let points = 0;
//         if (correct) {
//           const timeBonus = !isTimeout && timeLeft > 30 ? 5 : 0;
//           points = 10 + timeBonus + streak * 2;
//         } else {
//           points = isTimeout ? -10 : -5;
//         }

//         const answeredQuestion = {
//           question,
//           userAnswer: isTimeout ? "(timeout - no answer)" : userAnswer,
//           correct,
//           points,
//         };

//         set((state) => ({
//           userAnswer: "",
//           showExplanation: true,
//           isCorrect: correct,
//           answeredQuestions: [...state.answeredQuestions, answeredQuestion],
//           score: Math.max(0, state.score + points),
//           streak: correct ? state.streak + 1 : 0,
//           isTimerActive: false,
//           lastUpdateTime: null,
//         }));
//       },

//       nextQuestion: () => {
//         const state = get();
//         if (state.currentQuestionIndex < state.questions.length - 1) {
//           set({
//             currentQuestionIndex: state.currentQuestionIndex + 1,
//             userAnswer: "",
//             showExplanation: false,
//             isCorrect: false,
//             timeLeft: state.timerDuration,
//             isTimerActive: true,
//             lastUpdateTime: Date.now(),
//           });
//         } else {
//           set({
//             gameFinished: true,
//             isTimerActive: false,
//             lastUpdateTime: null,
//             showExplanation: false,
//           });
//         }
//       },

//       restartQuiz: () => {
//         set({
//           difficulty: null,
//           currentQuestionIndex: 0,
//           userAnswer: "",
//           showExplanation: false,
//           isCorrect: false,
//           gameStarted: false,
//           gameFinished: false,
//           answeredQuestions: [],
//           score: 0,
//           streak: 0,
//           timeLeft: TIMER_DURATION,
//           isTimerActive: false,
//           lastUpdateTime: null,
//           questions: [],
//         });
//       },

//       resetGame: () => {
//         set({
//           currentQuestionIndex: 0,
//           userAnswer: "",
//           showExplanation: false,
//           isCorrect: false,
//           gameFinished: false,
//           answeredQuestions: [],
//           score: 0,
//           streak: 0,
//           timeLeft: TIMER_DURATION,
//           isTimerActive: false,
//           lastUpdateTime: null,
//           questions: [],
//         });
//       },
//     }),
//     {
//       name: "quiz-storage",
//       partialize: (state) => ({
//         // Persist all timer-related state
//         difficulty: state.difficulty,
//         currentQuestionIndex: state.currentQuestionIndex,
//         userAnswer: state.userAnswer,
//         showExplanation: state.showExplanation,
//         isCorrect: state.isCorrect,
//         gameStarted: state.gameStarted,
//         gameFinished: state.gameFinished,
//         answeredQuestions: state.answeredQuestions,
//         score: state.score,
//         streak: state.streak,
//         timeLeft: state.timeLeft,
//         isTimerActive: state.isTimerActive,
//         lastUpdateTime: state.lastUpdateTime,
//         timerDuration: state.timerDuration,
//         questions: state.questions,
//       }),
//     }
//   )
// );
