export interface MathProblem {
  question: string;
  answer: number;
  remainder?: number;
}

// generate 1-digit up to 3-digit add, sub, multi, div problem
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
      return { question: `${a} + ${b}`, answer: sum };

    case "Subtraction":
      if (b > a) [a, b] = [b, a];
      let difference = a - b;
      return { question: `${a} - ${b}`, answer: difference };

    case "Multiplication":
      let product = a * b;
      return { question: `${a} × ${b}`, answer: product };

    case "Division":
      if (b == 0) b = 1;
      let quotient = Math.floor(a / b);
      let remainder = a % b;
      return {
        question: `${a} ÷ ${b}`,
        answer: quotient,
        remainder: remainder,
      };
  }
}

// generate 1-digit order-of-operations problem
export function generateOrderOfOperationsProblem(): MathProblem {
  let question = "";
  let answer = 0;
  do {
    const nums = [rand(1, 9), rand(1, 9), rand(1, 9)];

    const ops = ["+", "-", "×"];
    const op1 = ops[rand(0, ops.length - 1)];
    const op2 = ops[rand(0, ops.length - 1)];

    // Ensure no negative results by direct subtraction
    if (op1 === "-" && nums[0] < nums[1])
      [nums[0], nums[1]] = [nums[1], nums[0]];
    if (op2 === "-" && nums[1] < nums[2])
      [nums[1], nums[2]] = [nums[2], nums[1]];

    // Randomly choose a pattern
    // 1: a op1 b op2 c, 2: (a op1 b) op2 c, 3: a op1 (b op2 c)
    const pattern = rand(1, 3);

    // Helper to apply a single operation
    const apply = (x: number, op: string, y: number) => {
      switch (op) {
        case "+":
          return x + y;
        case "-":
          return x - y;
        case "×":
          return x * y;
      }
    };

    // Helper to apply two operations with correct PEMDAS order
    const applyWithPrecedence = (
      a: number,
      op1: string,
      b: number,
      op2: string,
      c: number,
    ) => {
      const precedence: Record<string, number> = {
        "+": 1,
        "-": 1,
        "×": 2,
      };

      if (precedence[op1] >= precedence[op2]) {
        // do a op1 b first
        const first = apply(a, op1, b);
        return apply(first, op2, c);
      } else {
        // do b op2 c first
        const first = apply(b, op2, c);
        return apply(a, op1, first);
      }
    };

    // Build question & compute answer based on pattern
    if (pattern === 1) {
      // a op1 b op2 c
      question = `${nums[0]} ${op1} ${nums[1]} ${op2} ${nums[2]}`;
      answer = applyWithPrecedence(nums[0], op1, nums[1], op2, nums[2]);
    } else if (pattern === 2) {
      // (a op1 b) op2 c
      question = `(${nums[0]} ${op1} ${nums[1]}) ${op2} ${nums[2]}`;
      answer = apply(apply(nums[0], op1, nums[1]), op2, nums[2]);
    } else {
      // a op1 (b op2 c)
      question = `${nums[0]} ${op1} (${nums[1]} ${op2} ${nums[2]})`;
      answer = apply(nums[0], op1, apply(nums[1], op2, nums[2]));
    }
  } while (answer < 0);

  return { question, answer };
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
