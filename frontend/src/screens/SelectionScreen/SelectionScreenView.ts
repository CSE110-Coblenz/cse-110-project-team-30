import Konva from "konva";
import type { View } from "../../types.ts";
import { PlayerModel } from "../../PlayerModel";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import troopsData from '../../troops.json';


/**
 * MenuScreenView - Renders the menu screen
 */
export class SelectionScreenView implements View {
    private group: Konva.Group;
    private handleHomeClick: () => void;
    private onCardSelected: (name: string) => void;
    private cardBorders: { [name: string]: Konva.Rect } = {};
    private troopsData: { [key: string]: { operation: string; hp: number; damage: number; level: number } };
    private handleBattleClick: () => void;
    private selectionBubbleGroup: Konva.Group;
    private selectionText: Konva.Text;

  

    constructor(callbacks: { onHome: () => void; onCardSelected: (name: string) => void; onBattle: () => void;}){
        this.handleHomeClick = callbacks.onHome;
        this.onCardSelected = callbacks.onCardSelected;
        this.handleBattleClick = callbacks.onBattle;
        

        this.troopsData = troopsData;
        this.group = new Konva.Group({ visible: false });

        const backgroundImage = new Image();
        backgroundImage.src = "card_images/wizard_background.png";
        backgroundImage.onload = () => {
            const bg = new Konva.Image({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            image: backgroundImage,
            opacity: 0.5,
            });
            this.group.add(bg);
            bg.moveToBottom();
            this.createWizardBubble(STAGE_WIDTH - 200, 275, "Select your cards. Click again to unselect")

        };

        // Create the selection bubble on the left
        this.selectionBubbleGroup = new Konva.Group({
            x: 30,
            y: 150
        });

        const bubbleWidth = 150;
        const bubblePadding = 10;

        const bubbleRect = new Konva.Rect({
            width: bubbleWidth,
            height: 100, // initial height, will grow dynamically
            fill: '#fff',
            stroke: '#333',
            strokeWidth: 2,
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.2,
        });

        this.selectionText = new Konva.Text({
            text: "Selected cards:\n",
            fontSize: 16,
            fontFamily: 'Arial',
            fill: '#000',
            padding: bubblePadding,
            width: bubbleWidth - bubblePadding*2 + 50,
            wrap: 'char',
        });

        this.selectionBubbleGroup.add(bubbleRect);
        this.selectionBubbleGroup.add(this.selectionText);
        this.group.add(this.selectionBubbleGroup);

        this.createHomeButton();
        this.loadCardGrid();
        this.createBattleButton();

    }

    /**
         * Create a home button at the top-left corner
         */
        private createHomeButton(): void {
        const buttonGroup = new Konva.Group({
            x: 30,
            y: 30,
            cursor: 'pointer',
        });

        const buttonRect = new Konva.Rect({
            width: 100,
            height: 40,
            fill: '#4a90e2',
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.2,
        });

        const buttonText = new Konva.Text({
            text: 'Home',
            fontSize: 20,
            fontFamily: 'Arial',
            fill: 'white',
            width: 100,
            height: 40,
            align: 'center',
            verticalAlign: 'middle',
        });


        buttonGroup.add(buttonRect);
        buttonGroup.add(buttonText);

        buttonGroup.on('click', this.handleHomeClick);
        buttonGroup.on('mouseover', () => {
            buttonRect.fill('#3a7bd5');
            buttonGroup.getLayer()?.draw();
        });
        buttonGroup.on('mouseout', () => {
            buttonRect.fill('#4a90e2');
            buttonGroup.getLayer()?.draw();
        });

        this.group.add(buttonGroup);
        }

        /**
         * Load and display 16 clickable image cards in a 4x4 grid
         */
        private loadCardGrid(): void {
        const rows = 4;
        const cols = 4;
        const cardWidth = 80;
        const cardHeight = 100;
        const gap = 10;

        const gridWidth = cols * cardWidth + (cols - 1) * gap;
        const gridHeight = rows * cardHeight + (rows - 1) * gap;

        const startX = (STAGE_WIDTH - gridWidth) / 2;
        const startY = (STAGE_HEIGHT - gridHeight) / 2 - 60;

        const rowImages = [
        '/card_images/swordsman.png',
        '/card_images/archer.png',
        '/card_images/spearman.png',
        '/card_images/cavalry.png',
        ];

        const troopsArray = this.getTroopsArray(); // linear array of 16 cards

        for (let row = 0; row < rows; row++) {
        const imageSrc = rowImages[row]!;
        for (let col = 0; col < cols; col++) {
            const x = startX + col * (cardWidth + gap);
            const y = startY + row * (cardHeight + gap);

            const cardIndex = row * cols + col; // linear index for troopsArray
            const cardStats = troopsArray[cardIndex];

            const imageObj = new Image();
            imageObj.src = imageSrc;

            imageObj.onload = () => {
            const cardGroup = new Konva.Group({
                x,
                y,
                width: cardWidth,
                height: cardHeight,
                cursor: 'pointer',
            });
            

            const cardImage = new Konva.Image({
                image: imageObj,
                width: cardWidth,
                height: cardHeight,
                cornerRadius: 8,
            });

            const cardBorder = new Konva.Rect({
                width: cardWidth,
                height: cardHeight,
                stroke: '#ccc',
                strokeWidth: 2,
                cornerRadius: 8,
                shadowColor: 'black',
                shadowBlur: 5,
                shadowOffset: { x: 2, y: 2 },
                shadowOpacity: 0.1,
            });

            cardGroup.on('mouseover', () => {
                cardBorder.stroke('#4a90e2');
                cardGroup.getLayer()?.draw();
            });
            cardGroup.on('mouseout', () => {
                cardBorder.stroke('#ccc');
                cardGroup.getLayer()?.draw();
            });

            // Click shows the popup with this card's stats
            cardGroup.on('click', () => {
                this.onCardSelected(cardStats!.name);
            });

            cardGroup.add(cardImage);
            cardGroup.add(cardBorder);
            this.group.add(cardGroup);
            cardGroup.getLayer()?.draw();
            };
        }
    }
}

    private getTroopsArray(): { name: string; operation: string; hp: number; damage: number; level: number }[] {
        return Object.entries(this.troopsData).map(([name, stats]) => ({ name, ...stats }));
    }

    private createWizardBubble(wizardX: number, wizardY: number, text: string): void {
        const padding = 10;
        const fontSize = 16;

        // Create text first
        const bubbleText = new Konva.Text({
            text,
            fontSize,
            fontFamily: 'Arial',
            fill: '#000',
            align: 'center',
            verticalAlign: 'middle',
        });

        // Create bubble background sized to fit text + padding
        const bubbleRect = new Konva.Rect({
            width: bubbleText.width() + padding * 2,
            height: bubbleText.height() + padding * 2,
            fill: '#fff',
            stroke: '#333',
            strokeWidth: 2,
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.2,
        });

        // Center the text inside the bubble
        bubbleText.x(padding);
        bubbleText.y(padding);

        // Group them together
        const bubbleGroup = new Konva.Group({
            x: wizardX - bubbleRect.width() / 2,
            y: wizardY - bubbleRect.height() - 10, // above wizard
        });

        bubbleGroup.add(bubbleRect);
        bubbleGroup.add(bubbleText);

        this.group.add(bubbleGroup);
        bubbleGroup.getLayer()?.draw();
    }

    private createBattleButton(): void {
        const buttonWidth = 200;
        const buttonHeight = 60;

        const buttonGroup = new Konva.Group({
            x: (STAGE_WIDTH - buttonWidth) / 2,
            y: STAGE_HEIGHT - buttonHeight - 40,   // 40px from bottom
            cursor: "pointer",
        });

        const buttonRect = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            cornerRadius: 20,
            fill: "#3cba54",
            shadowColor: "black",
            shadowBlur: 8,
            shadowOffset: { x: 3, y: 3 },
            shadowOpacity: 0.2,
        });

        const buttonText = new Konva.Text({
            text: "Battle",
            width: buttonWidth,
            height: buttonHeight,
            align: "center",
            verticalAlign: "middle",
            fontFamily: "Arial",
            fontSize: 28,
            fill: "white",
        });


        buttonGroup.add(buttonRect);
        buttonGroup.add(buttonText);

        // Hover effects
        buttonGroup.on("mouseover", () => {
            buttonRect.fill("#34a853");
            buttonGroup.getLayer()?.draw();
        });
        buttonGroup.on("mouseout", () => {
            buttonRect.fill("#3cba54");
            buttonGroup.getLayer()?.draw();
        });

        // Click event
        buttonGroup.on("click", () => {
            this.handleBattleClick();
        });

        this.group.add(buttonGroup);
    }

    updateSelectionBubble(selectedCards: string[]) {
        if (!this.selectionText) return;

        this.selectionText.text("Selected cards:\n" + selectedCards.join("\n"));

        // adjust bubble height based on text
        const newHeight = this.selectionText.height() + 20; // padding
        (this.selectionBubbleGroup.children[0] as Konva.Rect).height(newHeight);

        this.selectionBubbleGroup.getLayer()?.draw();
    }

  /**
   * Show the screen
   */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
        this.updateSelectionBubble([]);
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
