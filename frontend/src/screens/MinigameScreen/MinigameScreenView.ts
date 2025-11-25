import Konva from "konva";
import type { View } from "../../types.ts";
import { PlayerModel } from "../../PlayerModel";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";


/**
 * MenuScreenView - Renders the menu screen
 */
export class SelectionScreenView implements View {
    private group: Konva.Group;
    private handleHomeClick: () => void;

  

    constructor(callbacks: { onHome: () => void; onCardSelected: (name: string) => void; onBattle: () => void;}){
        this.handleHomeClick = callbacks.onHome;
        
        this.group = new Konva.Group({ visible: false });

        const backgroundImage = new Image();
        backgroundImage.src = "minigame_images/castle_background.png";
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

        };
        this.createHomeButton();
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
