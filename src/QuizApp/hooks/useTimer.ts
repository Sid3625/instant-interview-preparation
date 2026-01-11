import { useState, useEffect, useCallback } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  start: () => void;
  reset: (time: number) => void;
}

export const useTimer = (initialTime: number, onTimeout: () => void): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const start = useCallback(() => setIsActive(true), []);
  const reset = useCallback((time: number) => {
    setTimeLeft(time);
    setIsActive(false);
  }, []);

  return { timeLeft, isActive, start, reset };
};