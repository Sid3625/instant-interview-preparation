import type { TestCase } from "../types/types";

export function deepEqual(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

export function normalizeInput(question: any, tc: TestCase) {
  if (question.evaluationType === "async") {
    return tc.input.map((arg) => {
      if (Array.isArray(arg)) {
        return arg.map((v) => (v instanceof Promise ? v : Promise.resolve(v)));
      }

      return arg instanceof Promise ? arg : Promise.resolve(arg);
    });
  }
  return tc.input;
}
export function extractFunctionName(code: string | undefined): string | null {
  if (!code) return null;
  // function foo(...) {}
  let match = code.match(/function\s+([a-zA-Z_$][\w$]*)\s*\(/);
  if (match) return match[1];

  // const foo = (...) => {}
  match = code.match(/const\s+([a-zA-Z_$][\w$]*)\s*=\s*\(/);
  if (match) return match[1];

  // let foo = function(...) {}
  match = code.match(/([a-zA-Z_$][\w$]*)\s*=\s*function\s*\(/);
  if (match) return match[1];

  return null;
}
