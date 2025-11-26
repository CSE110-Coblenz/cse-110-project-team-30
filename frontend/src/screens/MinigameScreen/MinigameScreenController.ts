import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MinigameScreenModel } from "./MinigameScreenModel.ts";
import { MinigameScreenView } from "./MinigameScreenView.ts";
import { MINIGAME_DURATION } from "../../constants.ts";

/**
 * MinigameScreenController - Coordinates minigame logic between Model and View
 */
export class MinigameScreenController extends ScreenController {
  private model: MinigameScreenModel;
  private view: MinigameScreenView;
  private screenSwitcher: ScreenSwitcher;
  private minigameTimer: number | null = null;
  private isCorrect: boolean | null = null;

  private dragonRoarSound: HTMLAudioElement;
  private babyDragonSound: HTMLAudioElement;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new MinigameScreenModel();
    this.view = new MinigameScreenView(
      () => this.handleHomeClick(),
      () => this.handleLeaveClick(),
      () => this.handleContinueClick(),
      (answer: number) => this.handleSubmitClick(answer),
      (location: string) => this.handleOkayClick(location),
    );

    this.dragonRoarSound = new Audio("/dragonRoar.mp3");
    this.babyDragonSound = new Audio("/babyDragon.mp3");
  }

  /**
   * Start the minigame
   */
  startMinigame(): void {
    // Reset model state
    this.model.reset();

    // Update view
    this.view.updateTimer(MINIGAME_DURATION);
    this.view.show();

    this.startTimer();
  }

  /**
   * Start the countdown timer
   */
  private startTimer(): void {
    let timeRemaining = MINIGAME_DURATION;
    console.log("Starting timer with seconds:", timeRemaining);
    this.minigameTimer = setInterval(() => {
      timeRemaining -= 1;
      console.log("Starting timer with seconds:", timeRemaining);
      this.view.updateTimer(timeRemaining);
      if (timeRemaining <= 0) {
        this.endMinigame(
          "complete",
          this.model.hasEnoughCorrect() ? "win" : "lose",
        );
      }
    }, 1000);
  }

  /**
   * Stop the timer
   */
  private stopTimer(): void {
    if (this.minigameTimer !== null) {
      clearInterval(this.minigameTimer);
      this.minigameTimer = null;
    }
  }

  /**
   * Asks the user to answer a math problem
   */
  public askProblem() {
    console.log(`setting a math problem...`);
    const problem = this.model.generateProblem();

    this.view.showMathPopup(
      problem.question,
      (answer) => this.handleSubmitClick(answer),
      (location) => this.handleOkayClick(location),
      this.model.getQuestionsAsked(),
      this.model.getCorrectAnswers(),
      this.model.getTotalQuestions(),
      this.model.getMinCorrectAnswers(),
    );
  }

  /**
   * Handle home button click
   */
  private handleHomeClick(): void {
    console.log("entered home click handler");
    this.view.showConfirmPopup(
      () => this.handleLeaveClick(),
      () => this.handleContinueClick(),
    );
  }

  /**
   * Handle continue button click for minigame
   */
  private handleContinueClick(): void {
    console.log("entered continue click handler");
  }

  /**
   * Handle leave button click for home
   */
  private handleLeaveClick(): void {
    console.log("entered leave click handler");
    this.endMinigame("leave");
  }

  /**
   * Handle submit button click for math problem
   */
  private handleSubmitClick(userAnswer: number): void {
    console.log("entered submit click handler for math problem");
    const problem = this.model.getCurrentProblem();
    if (!problem) return;

    this.isCorrect = this.model.checkAnswer(userAnswer);
    console.log("checked answer");
    this.view.showFeedback(problem.answer, this.isCorrect);
    this.view.showStatusUpdate(
      this.model.getTotalQuestions(),
      this.model.getCorrectAnswers(),
    );
  }

  /**
   * Handle okay buttons clicks
   */
  private handleOkayClick(btnLocation: string): void {
    console.log("entered okay click handler");
    switch (btnLocation) {
      case "problem":
        if (this.isCorrect) {
          console.log("correct!");
        }

        this.isCorrect = null;

        // Decide what to do next
        if (this.model.hasEnoughCorrect()) {
          this.endMinigame("complete", "win");
        } else if (!this.model.canStillWin()) {
          this.endMinigame("complete", "lose"); // Not enough remaining questions to reach 5 correct
        } else if (!this.model.isFinished()) {
          this.askProblem();
        } else {
          this.endMinigame(
            "complete",
            this.model.hasEnoughCorrect() ? "win" : "lose",
          );
        }
        break;
      case "results":
        this.isCorrect = null;
        this.screenSwitcher.switchToScreen({
          type: "menu",
        });
        break;
    }
  }

  /**
   * End the minigame
   */
  private endMinigame(
    reason: "leave" | "complete",
    outcome: "win" | "lose",
  ): void {
    this.stopTimer();
    this.view.removeInputs();

    switch (reason) {
      case "leave":
        console.log("Now going to menu screen");
        this.screenSwitcher.switchToScreen({ type: "menu" });
        break;

      case "complete":
        console.log("Now showing the results popup");
        this.view.showResultsPopup(
          outcome,
          (location) => this.handleOkayClick(location),
          this.model.getTotalQuestions(),
          this.model.getMinCorrectAnswers(),
        );
        break;
    }
  }

  /**
   * Get the view group
   */
  getView(): MinigameScreenView {
    return this.view;
  }
}
