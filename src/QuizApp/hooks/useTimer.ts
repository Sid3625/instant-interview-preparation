import { useEffect, useCallback } from 'react';
import { useQuizStore } from '../store/quizStore';

export const useTimerEffect = (onTimeout: () => void) => {
  const { 
    timeLeft, 
    isTimerActive, 
    lastUpdateTime,
    setTimeLeft, 
    setIsTimerActive,
    setLastUpdateTime 
  } = useQuizStore();

  useEffect(() => {
    // Skip if timer is not active or we're showing explanation
    if (!isTimerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      const newTimeLeft = Math.max(0, timeLeft - 1);
      setTimeLeft(newTimeLeft);
      setLastUpdateTime(Date.now());
      
      if (newTimeLeft <= 0) {
        setIsTimerActive(false);
        setLastUpdateTime(null);
        onTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, lastUpdateTime, setTimeLeft, setIsTimerActive, setLastUpdateTime, onTimeout]);

  const startTimer = useCallback(() => {
    setIsTimerActive(true);
    setLastUpdateTime(Date.now());
  }, [setIsTimerActive, setLastUpdateTime]);

  const pauseTimer = useCallback(() => {
    setIsTimerActive(false);
    setLastUpdateTime(null);
  }, [setIsTimerActive, setLastUpdateTime]);

  const resetTimer = useCallback((time: number) => {
    setTimeLeft(time);
    setIsTimerActive(false);
    setLastUpdateTime(null);
  }, [setTimeLeft, setIsTimerActive, setLastUpdateTime]);

  return { 
    timeLeft, 
    isTimerActive, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    lastUpdateTime 
  };
};


export const useTimerResume = () => {
  const { resumeTimer } = useQuizStore();

  useEffect(() => {
  
      resumeTimer();
    // console.log(`Timer resumed. Remaining time: ${remainingTime}s`);
  }, [resumeTimer]);
};