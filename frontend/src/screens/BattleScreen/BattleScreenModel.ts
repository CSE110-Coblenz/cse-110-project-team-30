import troops from "../../troops.json";
import { generateMathProblem } from "../../mathGenerator";

/**
 * BattleScreenModel - Manages battle state
 */
export class BattleScreenModel {
  private points = 0;
  private currentProblem: MathProblem | null = null;

  constructor() {}

  /**
   * Get card operation
   */
  getCardOperation(cardType): string {
    return troops[cardType].operation;
  }

  /**
   * Generates each math problem
   */
  generateProblem(cardType) {
    const problem = generateMathProblem(
      troops[cardType].operation,
      troops[cardType].level,
    );
    this.currentProblem = problem;
    return problem;
  }

  /**
   * Get the current math problem
   */
  getCurrentProblem(): MathProblem | null {
    return this.currentProblem;
  }

  /**
   * Check answer correctness
   */
  checkAnswer(userAnswer: number, userRemainder?: number): boolean {
    if (!this.currentProblem) return false;

    let isCorrect = false;
    if (this.currentProblem.remainder !== undefined) {
      isCorrect =
        userAnswer === this.currentProblem.answer &&
        userRemainder === this.currentProblem.remainder;
    } else {
      isCorrect = userAnswer === this.currentProblem.answer;
    }
    return isCorrect;
  }

  /**
   * Reset battle state for a new game
   */
  reset(): void {
    // castles = 0    this.score = 0; to do
    this.currentProblem = null;
  }

  /**
   * Get current number of castles destroyed
   */
  getPoints(): number {
    return this.points; // to do
  }
}
