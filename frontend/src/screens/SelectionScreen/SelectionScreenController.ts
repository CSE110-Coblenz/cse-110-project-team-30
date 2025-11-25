import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { SelectionScreenView } from "./SelectionScreenView.ts";



export class SelectionScreenController extends ScreenController {
    private view: SelectionScreenView;
    private screenSwitcher: ScreenSwitcher;
    private selectedCards: string[] = [];

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        // Pass a callback to handle the "Home" button
        this.view = new SelectionScreenView({
            onHome: () => this.handleHomeClick(),

            // receive card selection from View
            onCardSelected: (cardName: string) => this.toggleCard(cardName),
            onBattle: () => this.handleBattleClick(),
        });

    }

    // Add or remove a card when clicked
    private toggleCard(cardName: string) {
        const index = this.selectedCards.indexOf(cardName);

        // If already selected → unselect it
        if (index !== -1) {
            this.selectedCards.splice(index, 1);
            this.view.updateSelectionBubble(this.selectedCards);
            return;
        }

        // If selecting more than 4 → ignore
        if (this.selectedCards.length >= 4) {
            return;
        }

        // Otherwise select it
        this.selectedCards.push(cardName);
        this.view.updateSelectionBubble(this.selectedCards);


        console.log("Selected cards:", this.selectedCards); //Test to see if cards are saved
    }

    /** Expose selected cards for other screens to use*/
    getSelectedCards() {
        return this.selectedCards;
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

    private handleBattleClick(): void {
        // Hide this screen
        this.view.hide();

        // Switch to the battle screen
        this.screenSwitcher.switchToScreen({ type: "battle" });
    }

    /**
     * Get the view
     */
    getView(): SelectionScreenView {
        return this.view;
    }
}