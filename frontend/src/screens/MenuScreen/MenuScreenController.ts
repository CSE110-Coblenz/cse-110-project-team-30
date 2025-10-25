import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MenuScreenView } from "./MenuScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MenuScreenController extends ScreenController {
        private view: MenuScreenView;
        private screenSwitcher: ScreenSwitcher;

        constructor(screenSwitcher: ScreenSwitcher) {
                super();
                this.screenSwitcher = screenSwitcher;
            	const buttons: ButtonConfig[] = [
            		{
                		id: "battle",
                		label: "Battle",
               			x: 200,
                		y: 300,
                		width: 150,
                		height: 50,
                		fill: "green",
                		textColor: "white",
            		},
            		{
                		id: "cards",
                		label: "Cards",
                		x: 200,
                		y: 380,
                		width: 150,
                		height: 50,
                		fill: "blue",
                		textColor: "white",
            		},
            		{
                		id: "levelup",
                		label: "Level Up",
                		x: 200,
                		y: 460,
                		width: 150,
                		height: 50,
                		fill: "purple",
                		textColor: "white",
            		},
            		{
                		id: "leaderboard",
                		label: "Leaderboard", 
                		x: 500,
                		y: 50,
                		width: 60,
                		height: 60,
                		textColor: "yellow",
            		}
        	];
		this.view = new MenuScreenView((buttonId: string) => this.handleClick(buttonId));
        }

        /**
         * Handle button click
         */
        private handleClick(buttonId: string): void {
        	switch (buttonId) {
			case "leaderboard": 
				this.screenSwitcher.switchToScreen({ type: "leaderboard"});
				break;
			case "battle":
			case "cards":
				this.screenSwitcher.switchToScreen({ type: "cards"});
				break;
			case "minigame":
				this.screenSwitcher.switchToScreen({ type: "minigame"});
				break;
        	}
	}

        /**
         * Get the view
	 * Not done, need points location
         */
        getView(): MenuScreenView {
		this.view.show(this.placeholder.getPoints());
                return this.view;
        }
}
