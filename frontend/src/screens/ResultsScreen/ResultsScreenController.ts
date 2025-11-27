import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import {
  ResultsScreenModel,
  type LeaderboardEntry,
} from "./ResultsScreenModel.ts";
import { ResultsScreenView } from "./ResultsScreenView.ts";

/**
 * ResultsScreenController - Handles results screen interactions
 */
export class ResultsScreenController extends ScreenController {
  private model: ResultsScreenModel;
  private view: ResultsScreenView;
  private screenSwitcher: ScreenSwitcher;

  //private gameOverSound: HTMLAudioElement;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new ResultsScreenModel();
    this.view = new ResultsScreenView(() => this.handleClick());

    //this.gameOverSound = new Audio("/gameover.mp3");
  }

  /**
   * Show results screen with final score
   */
  /* showResults(finalPoints: number): void {
                this.model.setFinalPoints(finalPoints);
                this.view.updateFinalPoints(finalPoints);
                this.view.show();

                this.gameOverSound.currentTime = 0;
                this.gameOverSound.play();
        }*/

  playerWon() {
    this.model.setTotalPoints(WIN_POINTS);
  }

  playerLost() {
    this.model.setTotalPoints(LOSS_POINTS);
  }

  playerTied() {
    this.model.setTotalPoints(DRAW_POINTS);
  }

  /**
   * Handle home button click
   */
  private handleClick(): void {
    this.screenSwitcher.switchToScreen({ type: "menu" });
  }

  /**
   * Get the view
   */
  getView(): ResultsScreenView {
    return this.view;
  }
}
