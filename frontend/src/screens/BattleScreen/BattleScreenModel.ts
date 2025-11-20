import troops from "../../troops.json";
import { generateMathProblem } from "../../mathGenerator";

/**
 * BattleScreenModel - Manages battle state
 */
export class BattleScreenModel {
  private points = 0;
  private currentProblem: MathProblem | null = null;

  constructor() {}
  /*
  // Function to get the level and operation for a given card ID
  public getCardData(cardId: number) {
    return this.cardData[cardId];
  }
*/

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
    this.score = 0;
    this.currentProblem = null;
  }

  /**
   * Get current points
   */
  getPoints(): number {
    return this.points;
  }
}
