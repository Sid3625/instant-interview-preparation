import React, { type JSX } from 'react';
import { Code, Bug, Zap, CheckCircle, Target, Layers } from 'lucide-react';

// ============================================
// TYPES & CONFIG
// ============================================

export interface QuizConfig {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
  features: string[];
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Easy to Hard' | 'Medium to Hard';
  estimatedTime: string;
}

export const AVAILABLE_QUIZZES: QuizConfig[] = [
  {
    id: 'guess-output',
    name: 'Guess the Output',
    description: 'Predict what JavaScript & React code will output',
    icon: <Code size={32} />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: ['Code Analysis', 'Output Prediction', '45s Timer'],
    questionCount: 25,
    difficulty: 'Easy to Hard',
    estimatedTime: '15-20 min'
  },
  {
    id: 'mcq-quiz',
    name: 'MCQ Challenge',
    description: 'Multiple choice questions on JavaScript concepts',
    icon: <CheckCircle size={32} />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    features: ['Multiple Choice', 'Concept Testing', 'Instant Feedback'],
    questionCount: 30,
    difficulty: 'Easy to Hard',
    estimatedTime: '10-15 min'
  },
  {
    id: 'code-debug',
    name: 'Debug the Code',
    description: 'Find and fix bugs in JavaScript code snippets',
    icon: <Bug size={32} />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    features: ['Bug Detection', 'Code Fixing', 'Real Scenarios'],
    questionCount: 20,
    difficulty: 'Medium to Hard',
    estimatedTime: '20-25 min'
  },
  {
    id: 'react-hooks',
    name: 'React Hooks Master',
    description: 'Master useState, useEffect, and custom hooks',
    icon: <Layers size={32} />,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    features: ['Hook Patterns', 'Side Effects', 'Performance'],
    questionCount: 18,
    difficulty: 'Medium to Hard',
    estimatedTime: '15-20 min'
  },
  {
    id: 'async-js',
    name: 'Async JavaScript',
    description: 'Promises, async/await, and event loop challenges',
    icon: <Zap size={32} />,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    features: ['Promises', 'Event Loop', 'Race Conditions'],
    questionCount: 22,
    difficulty: 'Medium to Hard',
    estimatedTime: '18-22 min'
  },
  {
    id: 'algorithms',
    name: 'Algorithm Sprint',
    description: 'Solve algorithm problems with optimal solutions',
    icon: <Target size={32} />,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    features: ['Problem Solving', 'Time Complexity', 'Optimization'],
    questionCount: 15,
    difficulty: 'Hard',
    estimatedTime: '25-30 min'
  }
];
