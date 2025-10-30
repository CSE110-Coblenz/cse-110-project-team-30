import type { Group } from "konva/lib/Group";

export interface View {
        getGroup(): Group;
        show(): void;
        hide(): void;
}

/**
 * Screen types for navigation
 *
 * - "login": Login screen
 * - "menu": Main menu screen
 * - "cards": Cards screen
 * - "battle": Battle screen
 * - "results": Results screen with total points
 * - score: Final score to display on results screen
 */
export type Screen =
        | { type: "login" }
        | { type: "menu" }
        | { type: "cards" }
        | { type: "battle" }
        | { type: "results"; points: number };

export abstract class ScreenController {
        abstract getView(): View;

        show(): void {
                this.getView().show();
        }

        hide(): void {
                this.getView().hide();
        }
}

export interface ScreenSwitcher {
        switchToScreen(screen: Screen): void;
}
