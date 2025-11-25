import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { PlayerModel } from "../../PlayerModel.ts";
import { MinigameScreenView } from "./MinigameScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MinigameScreenController extends ScreenController {
    private view: MinigameScreenView;
    private screenSwitcher: ScreenSwitcher;
  
    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        // Pass a callback to handle the "Home" button
        this.view = new MinigameScreenView(() => this.handleHomeClick());
    }
    
    /**
         * Handle home button click
         */
        private handleHomeClick(): void {
            // Hide this selection screen
            this.view.hide();

            // Switch back to menu screen
            this.screenSwitcher.switchToScreen({ type: "menu" });

        }

    /**
         * Get the view
         */
        getView(): MinigameScreenView {
            return this.view;
        }
    }

  
