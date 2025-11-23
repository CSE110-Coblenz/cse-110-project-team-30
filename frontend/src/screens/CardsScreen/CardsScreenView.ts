import Konva from 'konva';
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from '../../constants';
import troopsData from '../../troops.json';

//TODO: Use Nathan's Troop type in type.ts when that gets pushed
/**
 * Displays a 4x4 grid of image cards with title and home button
 */
export class CardsScreenView implements View {
  private group: Konva.Group;
  private handleHomeClick: () => void;
  private troopsData: { [key: string]: { operation: string; hp: number; damage: number; level: number } };



  constructor(handleHomeClick: () => void) {
    this.handleHomeClick = handleHomeClick; 
    this.troopsData = troopsData;

    //create group
    this.group = new Konva.Group({visible: false});

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
      this.createWizardBubble(1100, 275, "Click a button to learn more")

    };

    this.createTitle();
    this.createHomeButton();
    this.loadCardGrid();
    this.createOperationButtons();

  }
  

  /**
   * Create the title text at the top center
   */
  private createTitle(): void {
    const title = new Konva.Text({
      text: 'Card Library',
      fontSize: 48,
      fontFamily: 'Arial',
      fill: '#333',
      x: STAGE_WIDTH / 2,
      y: 40,
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);
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

    buttonText.offsetY(-4);

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
  const startY = (STAGE_HEIGHT - gridHeight) / 2 + 60;

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
          this.showCardStatsPopup(cardStats!);
        });

        cardGroup.add(cardImage);
        cardGroup.add(cardBorder);
        this.group.add(cardGroup);
        cardGroup.getLayer()?.draw();
      };
    }
  }
}

/**
 * Show a popup with card stats
 */
private showCardStatsPopup(stats: { name: string; hp: number; damage: number; level: number }) {
  const popupWidth = 200;
  const popupHeight = 120;

  const popupGroup = new Konva.Group({
    x: STAGE_WIDTH / 2 - popupWidth / 2,
    y: STAGE_HEIGHT / 2 - popupHeight / 2,
  });

  const background = new Konva.Rect({
    width: popupWidth,
    height: popupHeight,
    fill: '#ffffff',
    cornerRadius: 10,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: { x: 3, y: 3 },
    shadowOpacity: 0.3,
  });

  const text = new Konva.Text({
    text: `Name: ${stats.name}\nHP: ${stats.hp}\nDamage: ${stats.damage}\nLevel: ${stats.level}`,
    fontSize: 16,
    fontFamily: 'Arial',
    fill: '#333',
    padding: 10,
    width: popupWidth,
    height: popupHeight,
    align: 'center',
    verticalAlign: 'middle',
  });

  popupGroup.add(background);
  popupGroup.add(text);

  // Prevent clicks on popup from closing it
  popupGroup.on('click', (e) => {
    e.cancelBubble = true;
  });

  const layer = this.group.getLayer();
  if (!layer) return;

  // Add overlay to close popup when clicking outside
  const overlay = new Konva.Rect({
    x: 0,
    y: 0,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    fill: 'rgba(0,0,0,0.2)',
  });
  overlay.on('click', () => {
    popupGroup.destroy();
    overlay.destroy();
    layer.draw();
  });

  layer.add(overlay);
  layer.add(popupGroup);
  layer.draw();
}


    /**
   * Create four horizontal operation buttons aligned to the left of each row of cards
   */
  private createOperationButtons(): void {
    const operations = ["Addition", "Subtraction", "Multiplication", "Division"];
    operations.forEach((op, index) => {
      const buttonGroup = this.createButtonGroup(op, index);
      this.group.add(buttonGroup);
    });
  }

  /**
   * Create a Konva.Group for a single operation button
   */
  private createButtonGroup(operation: string, row: number): Konva.Group {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = 300;

    const y = this.calculateButtonY(row);

    const group = new Konva.Group({
      x: buttonX,
      y,
      cursor: 'pointer',
    });

    const rect = this.createButtonRect(buttonWidth, buttonHeight);
    const text = this.createButtonText(operation, buttonWidth, buttonHeight);

    group.add(rect);
    group.add(text);

    this.addButtonHoverEffect(group, rect);
    this.addButtonClickHandler(group, operation);

    return group;
  }

  /**
   * Calculate Y position for a button based on row index
   */
  private calculateButtonY(row: number): number {
    const rows = 4;
    const cardHeight = 100;
    const gap = 10;
    const startY = (STAGE_HEIGHT - (rows * cardHeight + (rows - 1) * gap)) / 2 + 60;
    return startY + 25 + row * (cardHeight + gap);
  }

  /**
   * Create the rectangular Konva button
   */
  private createButtonRect(width: number, height: number): Konva.Rect {
    return new Konva.Rect({
      width,
      height,
      fill: '#4a90e2',
      cornerRadius: 8,
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.2,
    });
  }

  /**
   * Create the button text
   */
  private createButtonText(text: string, width: number, height: number): Konva.Text {
    const buttonText = new Konva.Text({
      text,
      fontSize: 18,
      fontFamily: 'Arial',
      fill: 'white',
      width,
      height,
      align: 'center',
      verticalAlign: 'middle',
    });
    buttonText.offsetY(-4);
    return buttonText;
  }

  /**
   * Add hover effect to a button
   */
  private addButtonHoverEffect(group: Konva.Group, rect: Konva.Rect): void {
    group.on('mouseover', () => {
      rect.fill('#3a7bd5');
      group.getLayer()?.draw();
    });
    group.on('mouseout', () => {
      rect.fill('#4a90e2');
      group.getLayer()?.draw();
    });
  }

  /**
   * Add click handler to show video tutorial
   */
  private addButtonClickHandler(group: Konva.Group, operation: string): void {
    group.on('click', () => {
      const layer = this.group.getLayer();
      if (!layer) return;

      const videoSrc = this.getVideoSrc(operation);

      const video = document.createElement('video');
      video.src = videoSrc;
      video.crossOrigin = 'anonymous';
      video.autoplay = true;
      video.controls = true;

      const videoImage = new Konva.Image({
        image: video,
        x: STAGE_WIDTH / 2 - 280,
        y: STAGE_HEIGHT / 2 - 157,
        width: 560,
        height: 315,
      });

      const overlay = new Konva.Rect({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        fill: 'rgba(0,0,0,0.2)',
      });

      overlay.on('click', () => {
        video.pause();
        videoImage.destroy();
        overlay.destroy();
        layer.draw();
      });

      layer.add(overlay);
      layer.add(videoImage);

      const anim = new Konva.Animation(() => {}, layer);
      anim.start();
      video.play();
      layer.draw();
    });
  }

  /**
   * Return video path based on operation
   */
  private getVideoSrc(operation: string): string {
    switch (operation) {
      case 'Addition': return '/tutorial_videos/tutorial_addition.mp4';
      case 'Subtraction': return '/tutorial_videos/tutorial_subtraction.mp4';
      case 'Multiplication': return '/tutorial_videos/tutorial_multiplication.mp4';
      case 'Division': return '/tutorial_videos/tutorial_divison.mp4';
      default: return '';
    }
  }


  private getTroopsArray(): { name: string; operation: string; hp: number; damage: number; level: number }[] {
    return Object.entries(this.troopsData).map(([name, stats]) => ({ name, ...stats }));
  }


    /**
   * Adds a speech bubble above the wizard's head, sized to fit the text
   */
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
