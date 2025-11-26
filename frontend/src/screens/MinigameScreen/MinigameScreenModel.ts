import { generateOrderOfOperationsProblem } from "../../mathGenerator";

/**
 * MinigameScreenModel - Manages minigame state
 */
export class MinigameScreenModel {
  private minCorrectAnswers: number = 5;
  private totalQuestions: number = 7;
  private questionsAsked: number = 0;
  private correctAnswers: number = 0;
  private currentProblem: MathProblem | null = null;

  constructor() {}

  /**
   * Get the total number of questions offered
   */
  getTotalQuestions(): number {
    return this.totalQuestions;
  }

  /**
   * Get the number of questions asked so far
   */
  getQuestionsAsked(): number {
    return this.questionsAsked;
  }

  /**
   * Get the number of correct answers so far
   */
  getCorrectAnswers(): number {
    return this.correctAnswers;
  }

  /**
   * Get the number of questions that must be correct to win
   */
  getMinCorrectAnswers(): number {
    return this.minCorrectAnswers;
  }

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
  checkAnswer(userAnswer: number): boolean {
    if (!this.currentProblem) return false;

    let isCorrect = userAnswer === this.currentProblem.answer;
    if (isCorrect) this.correctAnswers++;
    return isCorrect;
  }

  /**
   * Check if the user answered enough questions correctly
   */
  hasEnoughCorrect(): boolean {
    return this.correctAnswers >= this.minCorrectAnswers;
  }

  /**
   * Check if the user has enough questions left to still win
   */
  canStillWin(): boolean {
    return (
      this.totalQuestions - this.questionsAsked + this.correctAnswers >=
      this.minCorrectAnswers
    );
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
    this.totalQuestions = 7;
    this.questionsAsked = 0;
    this.correctAnswers = 0;
    this.currentProblem = null;
  }
}
