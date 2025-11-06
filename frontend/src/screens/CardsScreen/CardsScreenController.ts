import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, Card } from "../../types.ts";
import { CardsScreenView } from "./CardsScreenView.ts";
import { CardDetailsPopup } from "./CardDetailsPopup.ts";
import { TutorialPlayerPopup } from "./TutorialPlayerPopup.ts";
import type { Group } from "konva/lib/Group";



export class CardsScreenController extends ScreenController {
    private view: CardsScreenView;
    private screenSwitcher: ScreenSwitcher;
    private cardDetailsPopup: CardDetailsPopup;
    private tutorialPlayerPopup: TutorialPlayerPopup;

    constructor(screenSwitcher: ScreenSwitcher, cardsData: Card[]) {
        super();
        this.screenSwitcher = screenSwitcher;

        // Create popup instances
        this.cardDetailsPopup = new CardDetailsPopup();
        this.tutorialPlayerPopup = new TutorialPlayerPopup();

        // Pass callbacks to handle the "Home" button and card clicks
        this.view = new CardsScreenView(
            () => this.handleHomeClick(),
            cardsData,
            (card: Card) => this.handleCardClick(card)
        );
    }

    /**
     * Handle home button click
     */
    private handleHomeClick(): void {
        // Hide popups if they are visible
        this.cardDetailsPopup.hide();
        this.tutorialPlayerPopup.hide();
        
        // Hide this cards screen
        this.view.hide();

        // Switch back to menu screen
        this.screenSwitcher.switchToScreen({ type: "menu" });
    }

    /**
     * Handle card click - show appropriate popup based on card lock status
     */
    private handleCardClick(card: Card): void {
        if (card.is_locked) {
            // Show tutorial popup for locked cards
            this.tutorialPlayerPopup.show(card);
        } else {
            // Show card details popup for unlocked cards
            this.cardDetailsPopup.show(card);
        }
    }

    /**
     * Get the view
     */
    getView(): CardsScreenView {
        return this.view;
    }

    /**
     * Get popup groups to add to layer
     */
    getPopupGroups(): Group[] {
        return [
            this.cardDetailsPopup.getGroup(),
            this.tutorialPlayerPopup.getGroup()
        ];
    }
}