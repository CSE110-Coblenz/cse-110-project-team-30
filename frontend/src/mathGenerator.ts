import troops from "./troops.json";

export interface MathProblem {
  num1: number;
  num2: number;
  question: string;
  answer: number;
  remainder?: number;
}

export function generateMathProblem(
  operation: string,
  level: number,
): MathProblem {
  let a = 0;
  let b = 0;

  // Level-based difficulty
  switch (level) {
    case 1: // 1-digit × 1-digit
      a = rand(0, 9);
      b = rand(0, 9);
      break;
    case 2: // 2-digit × 1-digit
      a = rand(10, 99);
      b = rand(0, 9);
      break;
    case 3: // 2-digit × 2-digit
      a = rand(10, 99);
      b = rand(10, 99);
      break;
    case 4: // 3-digit × 2-digit
      a = rand(100, 999);
      b = rand(10, 99);
      break;
  }

  switch (operation) {
    case "Addition":
      let sum = a + b;
      return { num1: a, num2: b, question: `${a} + ${b}`, answer: sum };

    case "Subtraction":
      if (b > a) [a, b] = [b, a];
      let difference = a - b;
      return { num1: a, num2: b, question: `${a} - ${b}`, answer: difference };

    case "Multiplication":
      let product = a * b;
      return { num1: a, num2: b, question: `${a} × ${b}`, answer: product };

    case "Division":
      if (b == 0) b = 1;
      let quotient = Math.floor(a / b);
      let remainder = a % b;
      return {
        num1: a,
        num2: b,
        question: `${a} ÷ ${b}`,
        answer: quotient,
        remainder: remainder,
      };
  }
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
