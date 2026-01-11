export interface Question {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  code: string;
  correctAnswer: string;
  explanation: string;
  hints: string[];
  type: 'text' | 'mcq';
  options?: string[];
}

export interface AnsweredQuestion {
  question: Question;
  userAnswer: string;
  correct: boolean;
  points: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | null;

export interface QuizState {
  difficulty: Difficulty;
  currentQuestionIndex: number;
  userAnswer: string;
  showExplanation: boolean;
  isCorrect: boolean;
  gameStarted: boolean;
  gameFinished: boolean;
  answeredQuestions: AnsweredQuestion[];
}