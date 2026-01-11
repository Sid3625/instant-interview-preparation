import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question, AnsweredQuestion, Difficulty } from "../types";
import { TIMER_DURATION } from "../constant";

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

  startGame: (difficulty: Difficulty) => void;
  submitAnswer: (params: {
    question: Question;
    userAnswer: string;
    isTimeout?: boolean;
    timeLeft: number;
    streak: number;
  }) => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  resetGame: () => void;

  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  isCurrentQuestionAnswered: () => boolean;
  restoreState: () => void;
  resumeTimer: () => number;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
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

      // Actions
      setDifficulty: (difficulty) => set({ difficulty }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setUserAnswer: (answer) => set({ userAnswer: answer }),
      setShowExplanation: (show) => set({ showExplanation: show }),
      setIsCorrect: (correct) => set({ isCorrect: correct }),
      setGameStarted: (started) => set({ gameStarted: started }),
      setGameFinished: (finished) => set({ gameFinished: finished }),
      setAnsweredQuestions: (questions) =>
        set({ answeredQuestions: questions }),
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

  
      startGame: (difficulty) => {
        set({
          difficulty,
          currentQuestionIndex: 0,
          userAnswer: "",
          showExplanation: false,
          isCorrect: false,
          gameStarted: true,
          gameFinished: false,
          answeredQuestions: [],
          score: 0,
          streak: 0,
          timeLeft: TIMER_DURATION,
          isTimerActive: true,
          lastUpdateTime: Date.now(),
        });
      },

      isCurrentQuestionAnswered: () => {
        const state = get();
        return state.answeredQuestions.some(
          (aq, index) => index === state.currentQuestionIndex
        );
      },

    
      restoreState: () => {
        const state = get();

        if (state.gameStarted && !state.gameFinished) {
          const isAnswered = state.answeredQuestions.some(
            (aq, index) => index === state.currentQuestionIndex
          );

          if (isAnswered) {
       
            set({
              showExplanation: true,
              isTimerActive: false,
              userAnswer: "", 
            });
          } else {
          
            set({
              showExplanation: false,
              isTimerActive: state.isTimerActive && state.timeLeft > 0,
            });
          }
        }
      },

      submitAnswer: ({
        question,
        userAnswer,
        isTimeout = false,
        timeLeft,
        streak,
      }) => {
        const normalizeAnswer = (answer: string): string => {
          return answer.trim().toLowerCase().replace(/\s+/g, " ");
        };

        const correct =
          normalizeAnswer(userAnswer) ===
          normalizeAnswer(question.correctAnswer);

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
        });
      },
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        // Persist all timer-related state
        difficulty: state.difficulty,
        currentQuestionIndex: state.currentQuestionIndex,
        userAnswer: state.userAnswer,
        showExplanation: state.showExplanation,
        isCorrect: state.isCorrect,
        gameStarted: state.gameStarted,
        gameFinished: state.gameFinished,
        answeredQuestions: state.answeredQuestions,
        score: state.score,
        streak: state.streak,
        timeLeft: state.timeLeft,
        isTimerActive: state.isTimerActive,
        lastUpdateTime: state.lastUpdateTime,
        timerDuration: state.timerDuration,
        questions: state.questions,
      }),
    }
  )
);
