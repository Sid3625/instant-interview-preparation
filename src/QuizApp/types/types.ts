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

export interface QuizSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
}
export interface QuizConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}