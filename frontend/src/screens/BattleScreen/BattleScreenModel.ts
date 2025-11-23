import troops from "../../troops.json";
import { generateMathProblem } from "../../mathGenerator";
import { ARENA_SIZE } from "../../constants";
import type { Troop, WSResponse, Grid } from "../../types";

/**
 * BattleScreenModel - Manages battle state
 */
export class BattleScreenModel {
  private points = 0;
  private currentProblem: MathProblem | null = null;
  private gameId: string = "";
  private readonly SIZE: number = ARENA_SIZE;
  private tiles!: Grid;
  private troopToPlace : string | null = null;

  constructor() {
    // Initialize tiles grid
    this.tiles = Array.from({ length: this.SIZE }, () =>
      Array.from({ length: this.SIZE }, () => [])
    );
  }
  
  /**
   * Update tiles with new troop data
   */
  updateTiles(troops: WSResponse["troops"]): void {
    // Clear existing tiles
    this.tiles = Array.from({ length: this.SIZE }, () =>
      Array.from({ length: this.SIZE }, () => [])
    );

    // Populate tiles with current troops
    for (const troop of troops) {
      const x = troop.Position.X;
      const y = troop.Position.Y;
      if (x >= 0 && x < this.SIZE && y >= 0 && y < this.SIZE) {
        if (!this.tiles[y]) {
          this.tiles[y] = [];
        }
        if (!this.tiles[y][x]) {
          this.tiles[y][x] = [];
        }
        this.tiles[y][x].push(troop);
      }
    }
  }
  getTiles(): Grid {
    return this.tiles;
  }
  /**
   * Set game ID
   */
  setGameId(id: string): void {
    this.gameId = id;
  }

  /**
   * Get game ID
   */
  getGameId(): string {
    return this.gameId;
  }

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
