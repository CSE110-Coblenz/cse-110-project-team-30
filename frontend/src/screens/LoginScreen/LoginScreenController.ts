import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LoginScreenView } from "./LoginScreenView.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * LoginScreenController - Handles login interactions
 */
export class LoginScreenController extends ScreenController {
  private view: LoginScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new LoginScreenView((id: string) => this.handleButtonClick(id));
  }

  /**
   * Handle button click
   */
  private handleButtonClick(buttonId: string): void {
    const { username, password } = this.view.getInputValues();

    if (!username.trim() || !password.trim()) {
      this.view.showErrorMessage("Please enter both username and password");
      return;
    }

    this.view.hideErrorMessage();

    switch (buttonId) {
      case "signUp":
        // if username is unique, save username & password and switch to main
        this.screenSwitcher.switchToScreen({ type: "menu" });
        break;
      case "login":
        // if username is saved and the password matches, switch to main
        this.screenSwitcher.switchToScreen({ type: "menu" });
        break;
    }
  }

  /**
   * Get the view
   */
  getView(): LoginScreenView {
    return this.view;
  }
}
