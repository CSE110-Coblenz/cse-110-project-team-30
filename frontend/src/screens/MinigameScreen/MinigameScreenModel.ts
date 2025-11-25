import { generateOrderOfOperationsProblem } from "../../mathGenerator";

/**
 * MinigameScreenModel - Manages minigame state
 */
export class MinigameScreenModel {
  private totalQuestions: number = 7;
  private questionsAsked: number = 0;
  private correctAnswers: number = 0;
  private currentProblem: MathProblem | null = null;

  constructor() {}

  /**
   * Generates each math problem
   */
  generateProblem() {
    const problem = generateOrderOfOperationsProblem();
    this.currentProblem = problem;
    this.questionsAsked++;
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
  checkAnswer(userAnswer: number, userRemainder: number): boolean {
    if (!this.currentProblem) return false;

    let isCorrect =
      userAnswer === this.currentProblem.answer &&
      userRemainder === this.currentProblem.remainder;
    if (isCorrect) correctAnswers++;
    return isCorrect;
  }

  /**
   * Check if the user answered enough questions correctly
   */
  hasEnoughCorrect(): boolean {
    return this.correctAnswers >= 5;
  }

  /**
   * Check if the user has enough questions left to still win
   */
  canStillWin(): boolean {
    return this.totalQuestions - this.questionsAsked + this.correctAnswers >= 5;
  }

  /**
   * Check if the user has answered all of the questions
   */
  isFinished(): boolean {
    return this.questionsAsked >= this.totalQuestions;
  }

  /**
   * Reset minigame state for a new game
   */
  reset(): void {
    totalQuestions: number = 7;
    questionsAsked: number = 0;
    correctAnswers: number = 0;
    this.currentProblem = null;
  }
}
