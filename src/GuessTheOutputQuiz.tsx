import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Code, Trophy, Zap, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Types
interface Question {
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

interface AnsweredQuestion {
  question: Question;
  userAnswer: string;
  correct: boolean;
  points: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | null;

// Demo questions
const DEMO_QUESTIONS: Question[] = [
  {
    id: 1,
    difficulty: 'easy',
    topic: 'hoisting',
    type: 'text',
    code: `console.log(a);
var a = 10;`,
    correctAnswer: 'undefined',
    explanation: '`var` declarations are hoisted to the top of their scope and initialized with `undefined`. So when `console.log(a)` runs, `a` exists but hasn\'t been assigned 10 yet.',
    hints: ['Think about variable hoisting', 'var vs let/const behavior']
  },
  {
    id: 2,
    difficulty: 'medium',
    topic: 'closures',
    type: 'mcq',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
    correctAnswer: '3 3 3',
    options: ['0 1 2', '3 3 3', 'undefined undefined undefined', '2 2 2'],
    explanation: '`var` has function scope, not block scope. By the time the setTimeout callbacks execute, the loop has finished and `i` is 3 for all callbacks. Using `let` instead would create a new binding for each iteration.',
    hints: ['var vs let scoping', 'Closure captures reference']
  },
  {
    id: 3,
    difficulty: 'easy',
    topic: 'type coercion',
    type: 'text',
    code: `console.log(1 + '1');
console.log(1 - '1');`,
    correctAnswer: '11\n0',
    explanation: 'The `+` operator concatenates when one operand is a string, resulting in "11". The `-` operator only works with numbers, so JavaScript coerces the string to a number, resulting in 0.',
    hints: ['String concatenation vs numeric operation']
  },
  {
    id: 4,
    difficulty: 'hard',
    topic: 'event loop',
    type: 'mcq',
    code: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
    correctAnswer: 'A D C B',
    options: ['A B C D', 'A D C B', 'A C D B', 'A B D C'],
    explanation: 'Synchronous code runs first (A, D). Promises (microtasks) have higher priority than setTimeout (macrotasks), so C runs before B, even though both have 0 delay.',
    hints: ['Event loop priorities', 'Microtasks vs macrotasks']
  },
  {
    id: 5,
    difficulty: 'medium',
    topic: 'this keyword',
    type: 'mcq',
    code: `const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name);
  }
};
const greet = obj.greet;
greet();`,
    correctAnswer: 'undefined',
    options: ['Alice', 'undefined', 'null', 'Error'],
    explanation: 'When `greet` is called as a standalone function, `this` refers to the global object (or undefined in strict mode), not `obj`. To preserve context, you could use `obj.greet()` or bind the function.',
    hints: ['Context loss', 'Method vs function call']
  },
  {
    id: 6,
    difficulty: 'hard',
    topic: 'async/await',
    type: 'text',
    code: `async function test() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
}
test();
console.log('3');`,
    correctAnswer: '1\n3\n2',
    explanation: 'The function executes synchronously until the first `await`. Then it yields control back to the event loop. "3" prints from the main thread, then the promise resolves and "2" prints.',
    hints: ['Async functions pause at await', 'Event loop behavior']
  },
  {
    id: 7,
    difficulty: 'easy',
    topic: 'array methods',
    type: 'mcq',
    code: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
    correctAnswer: '4',
    options: ['3', '4', '5', 'undefined'],
    explanation: 'The push() method adds an element to the end of the array and returns the new length. The array now contains [1, 2, 3, 4], so the length is 4.',
    hints: ['Array mutation', 'Push method behavior']
  },
  {
    id: 8,
    difficulty: 'medium',
    topic: 'destructuring',
    type: 'mcq',
    code: `const { a, b, c } = { a: 1, b: 2 };
console.log(c);`,
    correctAnswer: 'undefined',
    options: ['null', 'undefined', 'Error', '0'],
    explanation: 'When destructuring, if a property doesn\'t exist in the source object, the variable is assigned `undefined`. Since there\'s no `c` property in the object, `c` becomes undefined.',
    hints: ['Destructuring default values', 'Missing properties']
  },
   {
    id: 9,
    difficulty: 'easy',
    topic: 'equality',
    type: 'mcq',
    code: `console.log(0 == false);
console.log(0 === false);`,
    correctAnswer: 'true\nfalse',
    options: ['true true', 'false false', 'true false', 'false true'],
    explanation: '`==` allows type coercion, so 0 == false is true. `===` checks both type and value, so 0 !== false.',
    hints: ['Loose vs strict equality']
  },

  {
    id: 10,
    difficulty: 'medium',
    topic: 'this keyword',
    type: 'text',
    code: `const obj = {
  value: 10,
  arrow: () => console.log(this.value),
  normal() {
    console.log(this.value);
  }
};
obj.arrow();
obj.normal();`,
    correctAnswer: 'undefined\n10',
    explanation: 'Arrow functions don’t have their own `this`; they use lexical `this` (global). Normal methods bind `this` to the object.',
    hints: ['Arrow functions', 'Lexical this']
  },

  {
    id: 11,
    difficulty: 'medium',
    topic: 'array methods',
    type: 'text',
    code: `const arr = [1, 2, 3];
const result = arr.map(x => x * 2);
console.log(arr === result);`,
    correctAnswer: 'false',
    explanation: '`map` returns a new array and does not mutate the original array.',
    hints: ['Immutable methods', 'map vs forEach']
  },

  {
    id: 12,
    difficulty: 'hard',
    topic: 'event loop',
    type: 'text',
    code: `setTimeout(() => console.log('timeout'));

Promise.resolve()
  .then(() => console.log('promise1'))
  .then(() => console.log('promise2'));

console.log('start');`,
    correctAnswer: 'start\npromise1\npromise2\ntimeout',
    explanation: 'Synchronous code runs first, then microtasks (Promises), then macrotasks (setTimeout).',
    hints: ['Microtask queue', 'Macrotask queue']
  },

  {
    id: 13,
    difficulty: 'medium',
    topic: 'spread operator',
    type: 'mcq',
    code: `const obj = { a: 1, b: 2 };
const copy = { ...obj };
copy.a = 100;
console.log(obj.a);`,
    correctAnswer: '1',
    options: ['1', '100', 'undefined', 'Error'],
    explanation: 'Spread operator creates a shallow copy. Changing `copy.a` does not affect `obj.a`.',
    hints: ['Shallow copy', 'Spread operator']
  },

  {
    id: 14,
    difficulty: 'hard',
    topic: 'closures',
    type: 'text',
    code: `function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}

const fn1 = outer();
fn1();
fn1();`,
    correctAnswer: '1\n2',
    explanation: 'Closures allow the inner function to remember variables from its outer scope even after the outer function has executed.',
    hints: ['Closure memory', 'Function scope']
  },

  {
    id: 15,
    difficulty: 'medium',
    topic: 'reference vs value',
    type: 'mcq',
    code: `let a = { x: 1 };
let b = a;
b.x = 2;
console.log(a.x);`,
    correctAnswer: '2',
    options: ['1', '2', 'undefined', 'Error'],
    explanation: 'Objects are assigned by reference. Both `a` and `b` point to the same object.',
    hints: ['Reference types', 'Object mutation']
  },

  {
    id: 16,
    difficulty: 'hard',
    topic: 'async/await',
    type: 'text',
    code: `async function foo() {
  return 10;
}

foo().then(console.log);
console.log('end');`,
    correctAnswer: 'end\n10',
    explanation: 'Async functions always return a Promise. `.then()` runs after the synchronous code completes.',
    hints: ['Async returns promise']
  },
   {
    id: 17,
    difficulty: 'easy',
    topic: 'hoisting',
    type: 'text',
    code: `console.log(foo);
function foo() {}`,
    correctAnswer: 'function foo() {}',
    explanation: 'Function declarations are hoisted with their full definition.',
    hints: ['Function hoisting']
  },

  {
    id: 18,
    difficulty: 'medium',
    topic: 'hoisting',
    type: 'text',
    code: `console.log(foo);
var foo = function() {};`,
    correctAnswer: 'undefined',
    explanation: '`var` is hoisted but the function assignment is not.',
    hints: ['var vs function declaration']
  },

  {
    id: 19,
    difficulty: 'medium',
    topic: 'scope',
    type: 'text',
    code: `let a = 10;
{
  let a = 20;
}
console.log(a);`,
    correctAnswer: '10',
    explanation: '`let` is block scoped.',
    hints: ['Block scope']
  },

  {
    id: 20,
    difficulty: 'medium',
    topic: 'scope',
    type: 'mcq',
    code: `{
  var a = 10;
}
console.log(a);`,
    correctAnswer: '10',
    options: ['10', 'undefined', 'Error', 'null'],
    explanation: '`var` is function scoped, not block scoped.',
    hints: ['var scope']
  },

  {
    id: 21,
    difficulty: 'easy',
    topic: 'truthy/falsy',
    type: 'mcq',
    code: `console.log(Boolean([]));`,
    correctAnswer: 'true',
    options: ['true', 'false'],
    explanation: 'All objects (including arrays) are truthy.',
    hints: ['Truthy values']
  },

  {
    id: 22,
    difficulty: 'medium',
    topic: 'truthy/falsy',
    type: 'text',
    code: `console.log([] == false);`,
    correctAnswer: 'true',
    explanation: 'Loose equality triggers type coercion.',
    hints: ['Type coercion']
  },

  {
    id: 23,
    difficulty: 'hard',
    topic: 'type coercion',
    type: 'text',
    code: `console.log(null == undefined);
console.log(null === undefined);`,
    correctAnswer: 'true\nfalse',
    explanation: '`null` and `undefined` are equal with `==` but not `===`.',
    hints: ['Equality rules']
  },

  {
    id: 24,
    difficulty: 'medium',
    topic: 'arrays',
    type: 'text',
    code: `const arr = [1,2,3];
arr.length = 0;
console.log(arr);`,
    correctAnswer: '[]',
    explanation: 'Setting length to 0 clears the array.',
    hints: ['Array length']
  },

  {
    id: 25,
    difficulty: 'medium',
    topic: 'arrays',
    type: 'mcq',
    code: `console.log(typeof []);`,
    correctAnswer: 'object',
    options: ['array', 'object', 'function', 'undefined'],
    explanation: 'Arrays are objects in JavaScript.',
    hints: ['typeof operator']
  },

  {
    id: 26,
    difficulty: 'hard',
    topic: 'event loop',
    type: 'text',
    code: `console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
setTimeout(() => console.log(4));
console.log(5);`,
    correctAnswer: '1\n5\n3\n2\n4',
    explanation: 'Microtasks run before macrotasks.',
    hints: ['Event loop']
  },

  {
    id: 27,
    difficulty: 'medium',
    topic: 'functions',
    type: 'text',
    code: `function test(a, b = 2) {
  console.log(a + b);
}
test(5);`,
    correctAnswer: '7',
    explanation: 'Default parameters are used when arguments are missing.',
    hints: ['Default parameters']
  },

  {
    id: 28,
    difficulty: 'medium',
    topic: 'functions',
    type: 'mcq',
    code: `console.log(test);
var test = 10;`,
    correctAnswer: 'undefined',
    options: ['10', 'undefined', 'Error'],
    explanation: '`var` is hoisted but not initialized.',
    hints: ['Hoisting']
  },

  {
    id: 29,
    difficulty: 'hard',
    topic: 'this keyword',
    type: 'text',
    code: `const obj = {
  a: 1,
  fn() {
    return () => console.log(this.a);
  }
};
obj.fn()();`,
    correctAnswer: '1',
    explanation: 'Arrow functions inherit `this` from the surrounding scope.',
    hints: ['Arrow function this']
  },

  {
    id: 30,
    difficulty: 'medium',
    topic: 'destructuring',
    type: 'text',
    code: `const [a,,b] = [1,2,3];
console.log(a, b);`,
    correctAnswer: '1 3',
    explanation: 'Skipped elements are ignored.',
    hints: ['Array destructuring']
  },

  {
    id: 31,
    difficulty: 'easy',
    topic: 'strings',
    type: 'text',
    code: `console.log('5' + 3 - 2);`,
    correctAnswer: '51',
    explanation: 'String concatenation happens first, then numeric subtraction.',
    hints: ['Operator precedence']
  },

  {
    id: 32,
    difficulty: 'hard',
    topic: 'closures',
    type: 'text',
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    correctAnswer: '0\n1\n2',
    explanation: '`let` creates a new binding per iteration.',
    hints: ['Block scope']
  },

  {
    id: 33,
    difficulty: 'medium',
    topic: 'objects',
    type: 'text',
    code: `const obj = { a: 1 };
Object.freeze(obj);
obj.a = 2;
console.log(obj.a);`,
    correctAnswer: '1',
    explanation: 'Frozen objects cannot be mutated.',
    hints: ['Object.freeze']
  },

  {
    id: 34,
    difficulty: 'hard',
    topic: 'async',
    type: 'text',
    code: `async function f() {
  throw new Error('oops');
}
f().catch(() => console.log('error'));`,
    correctAnswer: 'error',
    explanation: 'Thrown errors in async functions reject the promise.',
    hints: ['Async error handling']
  },

  {
    id: 35,
    difficulty: 'medium',
    topic: 'rest operator',
    type: 'text',
    code: `function sum(...nums) {
  return nums.length;
}
console.log(sum(1,2,3));`,
    correctAnswer: '3',
    explanation: 'Rest operator collects arguments into an array.',
    hints: ['Rest operator']
  },

  {
    id: 36,
    difficulty: 'easy',
    topic: 'numbers',
    type: 'mcq',
    code: `console.log(NaN === NaN);`,
    correctAnswer: 'false',
    options: ['true', 'false'],
    explanation: 'NaN is not equal to anything, even itself.',
    hints: ['NaN behavior']
  },

  {
    id: 37,
    difficulty: 'medium',
    topic: 'numbers',
    type: 'text',
    code: `console.log(Object.is(NaN, NaN));`,
    correctAnswer: 'true',
    explanation: '`Object.is` correctly compares NaN.',
    hints: ['Object.is']
  },

  {
    id: 38,
    difficulty: 'hard',
    topic: 'prototype',
    type: 'mcq',
    code: `function A() {}
console.log(A.__proto__ === Function.prototype);`,
    correctAnswer: 'true',
    options: ['true', 'false'],
    explanation: 'Functions inherit from Function.prototype.',
    hints: ['Prototype chain']
  },

  {
    id: 39,
    difficulty: 'medium',
    topic: 'prototype',
    type: 'text',
    code: `const a = {};
console.log(a.__proto__ === Object.prototype);`,
    correctAnswer: 'true',
    explanation: 'Plain objects inherit from Object.prototype.',
    hints: ['Prototype']
  },

  {
    id: 40,
    difficulty: 'hard',
    topic: 'memory',
    type: 'text',
    code: `let a = {};
let b = a;
a = null;
console.log(b);`,
    correctAnswer: '{}',
    explanation: '`b` still holds the reference.',
    hints: ['Garbage collection']
  },

  {
    id: 41,
    difficulty: 'medium',
    topic: 'map vs forEach',
    type: 'text',
    code: `const r = [1,2,3].forEach(x => x * 2);
console.log(r);`,
    correctAnswer: 'undefined',
    explanation: '`forEach` returns undefined.',
    hints: ['Array methods']
  },

  {
    id: 42,
    difficulty: 'medium',
    topic: 'map vs forEach',
    type: 'text',
    code: `const r = [1,2,3].map(x => x * 2);
console.log(r);`,
    correctAnswer: '[2,4,6]',
    explanation: '`map` returns a new array.',
    hints: ['map']
  },

  {
    id: 43,
    difficulty: 'hard',
    topic: 'closures',
    type: 'text',
    code: `let count = 0;
(function immediate() {
  if (count === 0) {
    let count = 1;
    console.log(count);
  }
  console.log(count);
})();`,
    correctAnswer: '1\n0',
    explanation: 'Block scoped `let` shadows outer variable.',
    hints: ['Variable shadowing']
  },

  {
    id: 44,
    difficulty: 'medium',
    topic: 'json',
    type: 'mcq',
    code: `JSON.stringify({ a: undefined });`,
    correctAnswer: '{}',
    options: ['{}', '{a:null}', '{a:undefined}', 'Error'],
    explanation: 'Undefined values are omitted in JSON.',
    hints: ['JSON rules']
  },

  {
    id: 45,
    difficulty: 'hard',
    topic: 'json',
    type: 'text',
    code: `JSON.parse(JSON.stringify({ a: 1, b: undefined }));`,
    correctAnswer: '{ a: 1 }',
    explanation: 'Undefined properties are lost.',
    hints: ['Serialization']
  },

  {
    id: 46,
    difficulty: 'medium',
    topic: 'delete',
    type: 'text',
    code: `const obj = { a: 1 };
delete obj.a;
console.log(obj.a);`,
    correctAnswer: 'undefined',
    explanation: '`delete` removes the property.',
    hints: ['delete operator']
  }
];

// Custom Hooks
const useTimer = (initialTime: number, onTimeout: () => void) => {
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

  const start = () => setIsActive(true);
  const reset = (time: number) => {
    setTimeLeft(time);
    setIsActive(false);
  };

  return { timeLeft, isActive, start, reset };
};

const useScore = () => {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const addScore = (points: number, isCorrect: boolean) => {
    setScore(prev => Math.max(0, prev + points));
    setStreak(prev => isCorrect ? prev + 1 : 0);
  };

  const reset = () => {
    setScore(0);
    setStreak(0);
  };

  return { score, streak, addScore, reset };
};

// Components
const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="code-block">
    <pre>
      <code>{code}</code>
    </pre>
  </div>
);

const TimerDisplay: React.FC<{ timeLeft: number; totalTime: number }> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="timer-display">
      <Timer className={`timer-display__icon ${isLow ? 'timer-display__icon--low' : ''}`} />
      <div className="timer-display__bar">
        <div
          className={`timer-display__progress ${isLow ? 'timer-display__progress--low' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`timer-display__text ${isLow ? 'timer-display__text--low' : ''}`}>
        {timeLeft}s
      </span>
    </div>
  );
};

const Explanation: React.FC<{ question: Question; userAnswer: string; isCorrect: boolean }> = ({
  question,
  userAnswer,
  isCorrect
}) => (
  <div className={`explanation ${isCorrect ? 'explanation--correct' : 'explanation--incorrect'}`}>
    <div className="explanation__header">
      {isCorrect ? (
        <CheckCircle className="explanation__icon" />
      ) : (
        <XCircle className="explanation__icon" />
      )}
      <div className="explanation__content">
        <h3 className="explanation__title">{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h3>
        {!isCorrect && (
          <div className="explanation__comparison">
            <div className="answer-block">
              <p className="answer-block__label">Your answer:</p>
              <pre className="answer-block__code">{userAnswer || '(no answer)'}</pre>
            </div>
            <div className="answer-block">
              <p className="answer-block__label">Correct answer:</p>
              <pre className="answer-block__code">{question.correctAnswer}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="explanation__box">
      <h4 className="explanation__box-title">
        <AlertCircle className="icon-small" />
        Explanation:
      </h4>
      <p className="explanation__box-text">{question.explanation}</p>
    </div>
  </div>
);

// Main Component
const GuessTheOutputQuiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);

  const { score, streak, addScore, reset: resetScore } = useScore();
  const TIMER_DURATION = 45;

  const handleTimeout = useCallback(() => {
    if (!showExplanation) {
      handleSubmit();
    }
  }, [showExplanation]);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(TIMER_DURATION, handleTimeout);
// add random questions
  const questions = DEMO_QUESTIONS.filter(q => !difficulty || q.difficulty === difficulty);
  const currentQuestion = questions[currentQuestionIndex];
  
  

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    resetScore();
    setAnsweredQuestions([]);
    resetTimer(TIMER_DURATION);
    startTimer();
  };

  const normalizeAnswer = (answer: string): string => {
    return answer.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const handleSubmit = () => {
    const correct = normalizeAnswer(userAnswer) === normalizeAnswer(currentQuestion.correctAnswer);
    setIsCorrect(correct);
    setShowExplanation(true);

    let points = 0;
    if (correct) {
      const timeBonus = timeLeft > 30 ? 5 : 0;
      points = 10 + timeBonus + (streak * 2);
    } else {
      points = -5;
    }

    addScore(points, correct);
    setAnsweredQuestions(prev => [...prev, {
      question: currentQuestion,
      userAnswer,
      correct,
      points
    }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowExplanation(false);
      resetTimer(TIMER_DURATION);
      startTimer();
    } else {
      setGameFinished(true);
    }
  };

  const restartQuiz = () => {
    setDifficulty(null);
    setGameStarted(false);
    setGameFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowExplanation(false);
    resetScore();
    setAnsweredQuestions([]);
  };

  // Welcome Screen
  if (!gameStarted) {
    return (
      <div className="app-container app-container--welcome">
        <div className="content-wrapper">
          <div className="header-section">
            <div className="logo-section">
              <Code className="logo-section__icon" />
              <h1 className="logo-section__title">Guess the Output</h1>
            </div>
            <p className="header-section__subtitle">Master JavaScript & React Interview Questions</p>
          </div>

          <div className="card difficulty-card">
            <h2 className="card__title">Choose Difficulty</h2>
            <div className="difficulty-grid">
              <button onClick={() => startGame('easy')} className="difficulty-btn difficulty-btn--easy">
                <div className="difficulty-btn__emoji">🟢</div>
                <h3 className="difficulty-btn__title">Easy</h3>
                <p className="difficulty-btn__description">Basics, hoisting, map/filter</p>
              </button>
              <button onClick={() => startGame('medium')} className="difficulty-btn difficulty-btn--medium">
                <div className="difficulty-btn__emoji">🟡</div>
                <h3 className="difficulty-btn__title">Medium</h3>
                <p className="difficulty-btn__description">Closures, async/await, hooks</p>
              </button>
              <button onClick={() => startGame('hard')} className="difficulty-btn difficulty-btn--hard">
                <div className="difficulty-btn__emoji">🔴</div>
                <h3 className="difficulty-btn__title">Hard</h3>
                <p className="difficulty-btn__description">Event loop, stale closures, memoization</p>
              </button>
              <button onClick={() => startGame(null)} className="difficulty-btn difficulty-btn--all">
                <div className="difficulty-btn__emoji">🌈</div>
                <h3 className="difficulty-btn__title">All Levels</h3>
                <p className="difficulty-btn__description">Mixed difficulty challenge</p>
              </button>
            </div>
          </div>

          <div className="card scoring-card">
            <h3 className="scoring-card__title">
              <Zap className="icon-inline" />
              Scoring System
            </h3>
            <ul className="scoring-card__list">
              <li>✅ Correct answer: <strong>+10 points</strong></li>
              <li>⚡ Fast answer (30s+): <strong>+5 bonus</strong></li>
              <li>🔥 Streak bonus: <strong>+2 per streak</strong></li>
              <li>❌ Wrong answer: <strong>-5 points</strong></li>
              <li>⏱️ Timer: <strong>45 seconds per question</strong></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameFinished) {
    const correctCount = answeredQuestions.filter(q => q.correct).length;
    const accuracy = Math.round((correctCount / answeredQuestions.length) * 100);

    return (
      <div className="app-container app-container--results">
        <div className="content-wrapper">
          <div className="card results-card">
            <Trophy className="results-card__trophy" />
            <h2 className="results-card__title">Quiz Complete! 🎉</h2>
            <div className="results-card__score">{score}</div>
            
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-box__value">{correctCount}/{answeredQuestions.length}</div>
                <div className="stat-box__label">Correct</div>
              </div>
              <div className="stat-box">
                <div className="stat-box__value">{accuracy}%</div>
                <div className="stat-box__label">Accuracy</div>
              </div>
            </div>

            <div className="review-section">
              <h3 className="review-section__title">Question Review</h3>
              <div className="review-list">
                {answeredQuestions.map((q, i) => (
                  <div key={i} className={`review-item ${q.correct ? 'review-item--correct' : 'review-item--incorrect'}`}>
                    <span className="review-item__info">Q{i + 1}: {q.question.topic}</span>
                    <span className="review-item__points">
                      {q.correct ? '✓' : '✗'} {q.points > 0 ? '+' : ''}{q.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={restartQuiz} className="btn btn--primary btn--large btn--block">
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="app-container app-container--quiz">
      <div className="content-wrapper">
        <div className="card stats-header">
          <div className="stat-item">
            <div className="stat-item__value stat-item__value--primary">{score}</div>
            <div className="stat-item__label">Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value">{currentQuestionIndex + 1}/{questions.length}</div>
            <div className="stat-item__label">Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value stat-item__value--streak">🔥 {streak}</div>
            <div className="stat-item__label">Streak</div>
          </div>
        </div>

        <div className="card question-card">
          <div className="question-header">
            <div className="tags">
              <span className={`badge badge--${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="tags__topic">#{currentQuestion.topic}</span>
            </div>
          </div>

          {!showExplanation && (
            <TimerDisplay timeLeft={timeLeft} totalTime={TIMER_DURATION} />
          )}

          <h3 className="question-card__title">What will be the output?</h3>
          <CodeBlock code={currentQuestion.code} />

          {showExplanation ? (
            <>
              <Explanation
                question={currentQuestion}
                userAnswer={userAnswer}
                isCorrect={isCorrect}
              />
              <button onClick={handleNext} className="btn btn--primary btn--block">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            </>
          ) : (
            <>
              {currentQuestion.type === 'mcq' ? (
                <div className="mcq-section">
                  <label className="mcq-section__label">Choose the correct answer:</label>
                  <div className="mcq-options">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        className={`mcq-option ${userAnswer === option ? 'mcq-option--selected' : ''}`}
                      >
                        <span className="mcq-option__radio">
                          {userAnswer === option && <span className="mcq-option__dot" />}
                        </span>
                        <span className="mcq-option__text">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="answer-section">
                  <label className="answer-section__label">Your Answer:</label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type the expected output here (e.g., undefined or 1&#10;2&#10;3)"
                    className="answer-section__textarea"
                    rows={4}
                  />
                  <p className="answer-section__hint">
                    💡 Use Enter for multiple lines (e.g., for multiple console.logs)
                  </p>
                </div>
              )}
              <button
                onClick={() => handleSubmit()}
                disabled={!userAnswer.trim()}
                className="btn btn--primary btn--block"
              >
                Submit Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessTheOutputQuiz;