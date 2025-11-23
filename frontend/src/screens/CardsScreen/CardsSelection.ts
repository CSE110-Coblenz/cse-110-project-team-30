import Konva from 'konva';
import troopsData from '../../troops.json';
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from '../../constants';

/**
 * Manages selection of up to 4 cards from the card grid
 */
export class CardsSelection {
  private group: Konva.Group;
  private selectedCards: { name: string; hp: number; damage: number; level: number; operation: string }[] = [];
  private maxSelection = 4;
  private troopsArray: typeof this.selectedCards;

  constructor(group: Konva.Group) {
    this.group = group;

    // Flatten troops.json into an array
    this.troopsArray = Object.entries(troopsData).map(([name, info]: any) => ({
      name,
      operation: info.operation,
      hp: info.hp,
      damage: info.damage,
      level: info.level,
    }));

    // Attach click handlers to all cards in the group
    this.attachCardClickHandlers();
  }

  private attachCardClickHandlers() {
    this.group.getChildren().forEach((cardGroup: any) => {
      // Only process groups with an Image (cards)
      const cardImage = cardGroup.findOne('Image');
      if (!cardImage) return;

      // Save card stats on the group for easy access
      const cardStats = cardGroup.attrs.cardStats;
      if (!cardStats) return;

      cardGroup.off('click'); // remove old click handlers
      cardGroup.on('click', () => this.handleCardClick(cardGroup, cardStats));
    });
  }

  private handleCardClick(cardGroup: any, cardStats: typeof this.selectedCards[0]) {
    // Check duplicate
    if (this.selectedCards.find(c => c.name === cardStats.name)) {
      this.showMessage(`${cardStats.name} already selected`);
      return;
    }

    // Check max selection
    if (this.selectedCards.length >= this.maxSelection) {
      this.showMessage('You can only select 4 cards');
      return;
    }

    // Add to selection
    this.selectedCards.push(cardStats);
    this.showMessage(`Selected ${cardStats.name} (${this.selectedCards.length}/4)`);

    // Highlight selected card visually
    const border = cardGroup.findOne('Rect');
    if (border) {
      border.stroke('#4a90e2');
      cardGroup.getLayer()?.draw();
    }
  }

  private showMessage(message: string, duration = 2000) {
    const msgEl = document.createElement('div');
    msgEl.textContent = message;
    msgEl.style.position = 'fixed';
    msgEl.style.top = '20px';
    msgEl.style.left = '50%';
    msgEl.style.transform = 'translateX(-50%)';
    msgEl.style.backgroundColor = 'rgba(0,0,0,0.8)';
    msgEl.style.color = 'white';
    msgEl.style.padding = '10px 20px';
    msgEl.style.borderRadius = '8px';
    msgEl.style.zIndex = '1000';
    document.body.appendChild(msgEl);
    setTimeout(() => msgEl.remove(), duration);
  }

  // Return the selected cards
  getSelectedCards() {
    return this.selectedCards;
  }

  // Clear selection
  clearSelection() {
    this.selectedCards = [];
    // Reset card borders
    this.group.getChildren().forEach((cardGroup: any) => {
      const border = cardGroup.findOne('Rect');
      if (border) {
        border.stroke('#ccc');
        cardGroup.getLayer()?.draw();
      }
    });
    this.showMessage('Selection cleared');
  }

  /**
     * Show the screen
     */
    show(): void {
      this.group.visible(true);
      this.group.getLayer()?.draw();
    }
  
    /**
     * Hide the screen
     */
    hide(): void {
      this.group.visible(false);
      this.group.getLayer()?.draw();
    }
  
    /**
     * Return the main group
     */
    getGroup(): Konva.Group {
      return this.group;
    }
}
