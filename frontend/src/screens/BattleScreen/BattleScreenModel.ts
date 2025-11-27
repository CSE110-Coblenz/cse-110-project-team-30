import troopsJson from "../../troops.json";
import { generateMathProblem } from "../../mathGenerator";
import { ARENA_SIZE } from "../../constants";
import type { Troop, WSResponse, Grid } from "../../types";

/**
 * Defines the structure of a single troop/card
 */
interface Troop {
  operation: "Addition" | "Subtraction" | "Multiplication" | "Division";
  hp: number;
  damage: number;
  level: number;
}

// Cast troopsJson to Record<string, Troop> for type safety and editor autocomplete
const troops: Record<string, Troop> = troopsJson as unknown as Record<
  string,
  Troop
>;

/**
 * BattleScreenModel - Manages battle state
 */
export class BattleScreenModel {
  private currentProblem: MathProblem | null = null;
  private currentCardType: string | null = null;
  private currentIsCorrect: boolean | null = null;
  private gameId: string = "";
  public readonly SIZE: number = ARENA_SIZE;
  private tiles!: Grid;
  private troopToPlace: string | null = null;
  public isBlueTeam: boolean = false;

  constructor() {
    // Initialize tiles grid
    this.tiles = Array.from({ length: this.SIZE }, () =>
      Array.from({ length: this.SIZE }, () => []),
    );
  }

  /**
   * Update tiles with new troop data
   */
  updateTiles(troops: WSResponse["troops"]): void {
    // Clear existing tiles
    this.tiles = Array.from({ length: this.SIZE }, () =>
      Array.from({ length: this.SIZE }, () => []),
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
   * Get the current card type
   */
  getCurrentCardType(): string {
    return this.currentCardType;
  }

  /**
   * Get the current card object
   */
  getCurrentCardObject(): Troop | null {
    if (!this.currentCardType) return null;
    return troops[this.currentCardType];
  }

  /**
   * Generates each math problem
   */
  generateProblem(cardType: string): MathProblem {
    console.log(
      `generating problem for level ${troops[cardType].level} ${troops[cardType].operation}`,
    );
    this.currentCardType = cardType;
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

    if (this.currentProblem.remainder !== undefined) {
      this.currentIsCorrect =
        userAnswer === this.currentProblem.answer &&
        userRemainder === this.currentProblem.remainder;
    } else {
      this.currentIsCorrect = userAnswer === this.currentProblem.answer;
    }
    return this.currentIsCorrect;
  }

  /**
   * Get status of current math problem
   */
  getCurrentStatus(): MathProblem | null {
    return this.currentIsCorrect;
  }
  setTroopToPlace(troopType: string | null): void {
    this.troopToPlace = troopType;
  }

  getTroopToPlace(): string | null {
    return this.troopToPlace;
  }

  /**
   * Reset battle state for a new game
   */
  reset(): void {
    this.currentProblem = null;
    this.currentCardType = null;
    this.currentIsCorrect = null;
  }
}
