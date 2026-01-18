type QuestionType = "text" | "mcq" | "machine-coding";

export interface TestCase {
  name: string;
  input: unknown[];
  expectedOutput: unknown;
  test?: (fn: any) => boolean;
}
interface BaseQuestion {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  explanation: string;
  hints: string[];
  type: "text" | "mcq" | "machine-coding";
}
export interface TextQuestion extends BaseQuestion {
  type: "text";
  code: string;
  correctAnswer: string;
}
export interface McqQuestion extends BaseQuestion {
  type: "mcq";
  code: string;
  options: string[];
  correctAnswer: string;
}
export interface MachineCodingQuestion extends BaseQuestion {
  type: "machine-coding";
  prompt: string;
  starterCode: string;
  testCases: TestCase[];
}
export interface QuizData {
  questions: Question[];
}
export type EvaluationType =
  | "sync" // normal functions
  | "async" // Promise-based
  | "behavioral" // debounce, throttle
  | "conceptual"; // React.memo, hooks

export interface Question {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  type: QuestionType;

  // 🔁 Existing fields (optional now)
  code?: string;
  correctAnswer?: string;
  options?: string[];

  // 🆕 Machine coding fields
  prompt?: string;
  starterCode?: string;
  testCases?: TestCase[];
  evaluationType?: EvaluationType;

  explanation: string;
  hints: string[];
}

export interface AnsweredQuestion {
  question: Question;
  userAnswer: string;
  correct: boolean;
  points: number;
}

export type Difficulty = "easy" | "medium" | "hard" | null;

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
