import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BattleScreenModel } from "./BattleScreenModel.ts";
import { BattleScreenView } from "./BattleScreenView.ts";
import { MAX_CARDS_SELECTED, BATTLE_DURATION } from "../../constants.ts";

/**
 * BattleScreenController - Coordinates battle logic between Model and View
 */
export class BattleScreenController extends ScreenController {
  private model: BattleScreenModel;
  private view: BattleScreenView;
  private screenSwitcher: ScreenSwitcher;
  private battleTimer: number | null = null;

  //private squeezeSound: HTMLAudioElement;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new BattleScreenModel();
    this.view = new BattleScreenView(() => this.handleHomeClick());

    //this.squeezeSound = new Audio('/squeeze.mp3'); // Placeholder
  }

  /**
   * Start the battle
   */
  startBattle(): void {
    // Reset model state
    this.model.reset();

    // Update view
    //    this.view.updateScore(this.model.getPoints());
    this.view.updateTimer(BATTLE_DURATION);
    this.view.show();

    this.startTimer();
  }

  /**
   * Start the countdown timer
   */
  private startTimer(): void {
    let timeRemaining = BATTLE_DURATION;
    this.battleTimer = setInterval(() => {
      timeRemaining -= 1;
      this.view.updateTimer(timeRemaining);
      if (timeRemaining <= 0) {
        this.endBattle("complete");
      }
    }, 1000);
  }

  /**
   * Stop the timer
   */
  private stopTimer(): void {
    if (this.battleTimer !== null) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }

  /**
   * Handle home button click
   */
  private handleHomeClick(): void {
    //maybe add this.model.pauseBattle();
    this.view.showConfirmPopup({
      onQuit: () => {
        this.endBattle("quit");
      },
      onContinue: () => {
        console.log("continued playing");
      }, //this.model.resumeBattle();
    });
  }

  /**
   * Handle card click
   */
  private handleCardClick(cardType: string, level: number): void {
    this.model.generateProblem(cardType, level);
    this.view.showProblem(problem.question);
  }

  /**
   * Sets the cards the user selected
   */
  private setCards(cards: string[] | number[]) {
    if (cards.length !== MAX_CARDS_SELECTED) {
      console.error(
        `BattleScreenController: Expected ${MAX_CARDS_SELECTED} cards, got ${cards.length}`,
      );
      return;
    }

    this.view.loadCards(cards);
  }

  /**
   * Called when player submits an answer
   */
  private answerSubmit(userAnswer: number, userRemainder?: number): void {
    const problem = this.model.getCurrentProblem();
    if (!problem) return false;

    const isCorrect = false;
    if (problem.remainder !== undefined) {
      isCorrect =
        userAnswer === problem.answer && userRemainder === problem.remainder;
    } else {
      isCorrect = userAnswer === problem.answer;
    }

    if (isCorrect) {
      this.model.placeTroop(this.model.getSelectedTroop());
    }
  }

  /**
   * End the battle
   */
  private endBattle(reason: "quit" | "complete"): void {
    this.stopTimer();

    if (reason === "quit") {
      this.screenSwitcher.switchToScreen({ type: "menu" });
      return;
    }

    this.screenSwitcher.switchToScreen({
      type: "result",
      points: this.model.getPoints(),
    });
  }

  /**
   * Get the view group
   */
  getView(): BattleScreenView {
    return this.view;
  }
}
