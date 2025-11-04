import Konva from 'konva';
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from '../../constants';

/**
 * Displays a 4x4 grid of image cards with title and home button
 */
export class CardsScreenView implements View {
  private group: Konva.Group;
  private handleHomeClick: () => void;


  // TODO: get menu Cards Button handler and insert into constructor
  constructor(handleHomeClick: () => void) {
    this.handleHomeClick = handleHomeClick; 

    //create group
    this.group = new Konva.Group({visible: false});

    this.createTitle();
    this.createHomeButton();
    this.loadCardGrid();
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
        '/menu_images/swordsman.png',
        '/menu_images/archer.png',
        '/menu_images/spearman.png',
        '/menu_images/cavalry.png',
    ];

    for (let row = 0; row < rows; row++) {
      const imageSrc = rowImages[row]!;
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (cardWidth + gap);
        const y = startY + row * (cardHeight + gap);

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

          cardGroup.add(cardImage);
          cardGroup.add(cardBorder);
          this.group.add(cardGroup);
          cardGroup.getLayer()?.draw();
        };
      }
    }
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


// import Konva from 'konva';
// import type { View } from "../../types.ts";
// import { STAGE_WIDTH, STAGE_HEIGHT } from '../../constants';


// export class CardsScreenView implements View {
    
//     private group: Konva.Group;
//     private cardCollection: Konva.Text;
//     private cardImage: Konva.Image;
//     private cardCostText: Konva.Text;
//     private cardDescriptionText: Konva.Text;

//     constructor(handleHomeClick: () => void) {
//         this.group = new Konva.Group({
//             visible: false, 
//             zIndex: 1000    
//         });

//         const overlay = new Konva.Rect({
//             x: 0,
//             y: 0,
//             width: SCREEN_WIDTH,
//             height: SCREEN_HEIGHT,
//             fill: POPUP_STYLES.OVERLAY_COLOR,
//             opacity: POPUP_STYLES.OVERLAY_OPACITY
//         });
//         overlay.on('click', () => this.hide());
//         this.group.add(overlay);



//         // create home button
//         const homeButton = new Konva.Text({
//             x: windowX + windowWidth,
//             y: windowY,
//             text: 'Home',
//             fontSize: 20,
//             fill: '#333333',
//             fontFamily: 'Arial'
//         });
//         homeButton.on('click', () => this.hide());
//         this.group.add(homeButton);

        

//         //  Konva.Image
//         this.cardImage = new Konva.Image({
//             x: windowX + POPUP_STYLES.PADDING,
//             y: windowY + 80,
//             width: windowWidth - (POPUP_STYLES.PADDING * 2),
//             height: 200,
//             image: undefined 
//         });

//         // card cost
//         this.cardCostText = new Konva.Text({
//             x: windowX + POPUP_STYLES.PADDING,
//             y: windowY + 300,
//             text: 'Cost: ?',
//             fontSize: POPUP_STYLES.TEXT_FONT_SIZE,
//             fontFamily: POPUP_STYLES.FONT_FAMILY,
//             fill: POPUP_STYLES.TEXT_COLOR,
//         });

//         // -- card description
//         this.cardDescriptionText = new Konva.Text({
//             x: windowX + POPUP_STYLES.PADDING,
//             y: windowY + 340,
//             width: windowWidth - (POPUP_STYLES.PADDING * 2),
//             text: 'Card description goes here...',
//             fontSize: POPUP_STYLES.TEXT_FONT_SIZE,
//             fontFamily: POPUP_STYLES.FONT_FAMILY,
//             fill: POPUP_STYLES.TEXT_COLOR,
//         });



//        this.group.add(
//             this.cardNameText, 
//             imagePlaceholder, 
//             this.cardImage,   
//             this.cardCostText, 
//             this.cardDescriptionText
//         );
//     }

   
//     /**
// 	 * Show the screen
// 	 */
// 	show(): void {
// 		this.group.visible(true);
// 		this.group.getLayer()?.draw();
// 	}

// 	/**
// 	 * Hide the screen
// 	 */
// 	hide(): void {
// 		this.group.visible(false);
// 		this.group.getLayer()?.draw();
// 	}

// 	getGroup(): Konva.Group {
// 		return this.group;
// 	}
// }

