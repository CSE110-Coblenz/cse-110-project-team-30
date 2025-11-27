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
 * - "selection": Cards selection screen
 * - "battle": Battle screen
 * - "results": Results screen
 * - "leaderboard": Leaderboard screen
 * - cards: cards the user selects from the selection screen
 */
export type Screen =
  | { type: "login" }
  | { type: "menu" }
  | { type: "cards" }
  | { 
      type: "results"; 
      playerCrowns: number; 
      enemyCrowns: number 
    } 
  | { type: "battle"; cards: string[] }
  | { type: "minigame" }
  | { type: "selection" }
  | { type: "leaderboard" };

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

