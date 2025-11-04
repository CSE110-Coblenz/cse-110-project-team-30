import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { CardsScreenView } from "./CardsScreenView.ts";



export class CardsScreenController extends ScreenController {
    private view: CardsScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        // Pass a callback to handle the "Home" button
        this.view = new CardsScreenView(() => this.handleHomeClick());
    }

    /**
     * Handle home button click
     */
    private handleHomeClick(): void {
        // Hide this cards screen
        this.view.hide();

        // Switch back to menu screen
        this.screenSwitcher.switchToScreen({ type: "menu" });

    }

    /**
     * Get the view
     */
    getView(): CardsScreenView {
        return this.view;
    }
}