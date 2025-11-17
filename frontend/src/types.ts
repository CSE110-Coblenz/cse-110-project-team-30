

import type { Group } from "konva/lib/Group";



export interface Card {
  id: string;
  name: string;
  description: string;
  cost: number;
  imageUrl: string;      // "unlocked card image url"
  is_locked: boolean;    
  tutorial_path: string; // "locked card tutorial video path"
}




export interface ICardDetailsPopup {

  getGroup(): Group;
  
  show(card: Card): void;
  
  hide(): void;
}


export interface ITutorialPlayerPopup {
  
  getGroup(): Group;
  
  show(card: Card): void;
  
  hide(): void;
}



export interface View {
  getGroup(): Group;
  show(): void;
  hide(): void;
  getGroup(): Group;
  show(): void;
  hide(): void;
}


export type Screen =
  | { type: "menu" }
  | { type: "cards" }
  | { type: "battle" }
  | { type: "results"; points: number };

export abstract class ScreenController {
  abstract getView(): View;
  abstract getView(): View;

  show(): void {
    this.getView().show();
  }
  show(): void {
    this.getView().show();
  }

  hide(): void {
    this.getView().hide();
  }
  hide(): void {
    this.getView().hide();
  }
}

export interface ScreenSwitcher {
  switchToScreen(screen: Screen): void;
  switchToScreen(screen: Screen): void;
}