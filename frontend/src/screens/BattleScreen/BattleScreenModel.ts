import { MathProblem, generateMathProblem } from "./mathGenerator";

/**
 * BattleScreenModel - Manages battle state
 */
export class BattleScreenModel {
  private points = 0;
  private currentProblem: MathProblem | null = null;

  constructor() {}

  // Function to get the level and operation for a given card ID
  public getCardData(cardId: number) {
    return this.cardData[cardId];
  }

  generateProblem(operation: string, level: number) {
    this.currentProblem = generateMathProblem(operation, level);
  }

  /**
   * Reset battle state for a new game
   */
  reset(): void {
    this.score = 0;
  }

  /**
   * Get current points
   */
  getPoints(): number {
    return this.points;
  }
}
