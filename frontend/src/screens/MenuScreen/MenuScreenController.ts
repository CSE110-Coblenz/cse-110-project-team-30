import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MenuScreenView } from "./MenuScreenView.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MenuScreenController extends ScreenController {
  private view: MenuScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new MenuScreenView((id: string) => this.handleClick(id));
  }

  /**
   * Handle button click
   */
  private handleClick(buttonId: string): void {
    switch (buttonId) {
      case "leaderboard":
        this.screenSwitcher.switchToScreen({ type: "leaderboard" });
        break;
      case "battle":
      case "cards":
        this.screenSwitcher.switchToScreen({ type: "cards" });
        break;
      case "levelUp":
        this.screenSwitcher.switchToScreen({ type: "minigame" });
        break;
      case "logout":
        this.screenSwitcher.switchToScreen({ type: "login" });
        break;
    }
  }

  /**
   * Get total points
   */
  /*getTotalPoints(): number {
                return this.model.getPoints();
        }*/

  /**
   * Get the view
   * Not done, need points location
   */
  getView(): MenuScreenView {
    // this.view.updatePoints(this.placeholder.getPoints());
    return this.view;
  }
}
