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
            	const buttons: ButtonConfig[] = [
            		{
                		id: "leaderboard",
                		label: "Leaderboard", 
                		x: STAGE_WIDTH - 110,
                		y: 50,
                		width: 60,
                		height: 60,
                		textColor: "pink",
            		},
            		{
                		id: "battle",
                		label: "Battle",
               			x: STAGE_WIDTH / 2,
                		y: STAGE_HEIGHT / 2 - 150,
                		width: 150,
                		height: 50,
                		fill: "yellow",
                		textColor: "white",
            		},
            		{
                		id: "cards",
                		label: "Cards",
                		x: STAGE_WIDTH / 2,
                		y: STAGE_HEIGHT / 2 - 100,
                		width: 150,
                		height: 50,
                		fill: "blue",
                		textColor: "white",
            		},
            		{
                		id: "levelup",
                		label: "Level Up",
                		x: STAGE_WIDTH / 2,
                		y: STAGE_HEIGHT / 2 - 50,
                		width: 150,
                		height: 50,
                		fill: "purple",
                		textColor: "white",
            		}
        	];
		this.view = new MenuScreenView((buttons), (id: string) => this.handleClick(id));
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
