import { useState, useCallback } from 'react';

interface UseScoreReturn {
  score: number;
  streak: number;
  addScore: (points: number, isCorrect: boolean) => void;
  reset: () => void;
}

export const useScore = (): UseScoreReturn => {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const addScore = useCallback((points: number, isCorrect: boolean) => {
    setScore(prev => Math.max(0, prev + points));
    setStreak(prev => isCorrect ? prev + 1 : 0);
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setStreak(0);
  }, []);

  return { score, streak, addScore, reset };
};