import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LeaderboardScreenView } from "./LeaderboardScreenView.ts";

/**
 * LeaderboardScreenController - Handles leaderboard interactions
 */
export class LeaderboardScreenController extends ScreenController {
  private view: LeaderboardScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new LeaderboardScreenView(() => this.handleBackClick());
  }

  /**
   * Handle back button click
   */
  private handleBackClick(): void {
    this.screenSwitcher.switchToScreen({ type: "menu" });
  }

  /**
   * Get the view
   */
  getView(): LeaderboardScreenView {
    return this.view;
  }
}