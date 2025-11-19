import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { PlayerModel } from "../../PlayerModel.ts";
import { MenuScreenView } from "./MenuScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MenuScreenController extends ScreenController {
  private view: MenuScreenView;
  private screenSwitcher: ScreenSwitcher;
  private playerModel: PlayerModel;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.playerModel = new PlayerModel();
    this.view = new MenuScreenView(this.playerModel, (id: string) =>
      this.handleClick(id),
    );
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
        this.screenSwitcher.switchToScreen({ type: "battle" });
        break;
      case "cards":
        this.screenSwitcher.switchToScreen({ type: "cards" });
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
