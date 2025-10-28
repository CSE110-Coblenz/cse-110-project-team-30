// src/screens/CardsScreen/CardDetailsPopup.ts

import Konva from 'konva';
import type { Group } from 'konva/lib/Group';
import type { Card, ICardDetailsPopup } from '../../types'; // 导入契约
import { SCREEN_WIDTH, SCREEN_HEIGHT, POPUP_STYLES } from '../../constants';


export class CardDetailsPopup implements ICardDetailsPopup {
    
    private group: Group;
    
    // popup content elements
    private cardNameText: Konva.Text;
    private cardImage: Konva.Image;
    private cardCostText: Konva.Text;
    private cardDescriptionText: Konva.Text;

    constructor() {
        this.group = new Konva.Group({
            visible: false, 
            zIndex: 1000    
        });

        //create overlay
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            fill: POPUP_STYLES.OVERLAY_COLOR,
            opacity: POPUP_STYLES.OVERLAY_OPACITY
        });
        // click overlay to close popup
        overlay.on('click', () => this.hide());
        this.group.add(overlay);

        // create popup window
        const windowWidth = POPUP_STYLES.WINDOW_WIDTH;
        const windowHeight = POPUP_STYLES.WINDOW_HEIGHT;
        const windowX = (SCREEN_WIDTH - windowWidth) / 2;
        const windowY = (SCREEN_HEIGHT - windowHeight) / 2;

        const popupWindow = new Konva.Rect({
            x: windowX,
            y: windowY,
            width: windowWidth,
            height: windowHeight,
            fill: POPUP_STYLES.WINDOW_COLOR,
            cornerRadius: POPUP_STYLES.WINDOW_CORNER_RADIUS,
            shadowBlur: 10
        });
        this.group.add(popupWindow);

        // create close button
        const closeBtn = new Konva.Text({
            x: windowX + windowWidth - POPUP_STYLES.PADDING - 10,
            y: windowY + POPUP_STYLES.PADDING,
            text: 'X',
            fontSize: 20,
            fill: POPUP_STYLES.TEXT_COLOR,
            fontFamily: POPUP_STYLES.FONT_FAMILY
        });
        closeBtn.on('click', () => this.hide());
        this.group.add(closeBtn);

        
        // card name
        this.cardNameText = new Konva.Text({
            x: windowX,
            y: windowY + 40,
            width: windowWidth,
            text: 'Card Name',
            fontSize: POPUP_STYLES.TITLE_FONT_SIZE,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
            align: 'center'
        });

       const imagePlaceholder = new Konva.Rect({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 80,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: 200,
            fill: '#ccc' 
        });

        //  Konva.Image
        this.cardImage = new Konva.Image({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 80,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: 200,
            image: undefined 
        });

        // card cost
        this.cardCostText = new Konva.Text({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 300,
            text: 'Cost: ?',
            fontSize: POPUP_STYLES.TEXT_FONT_SIZE,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
        });

        // -- card description
        this.cardDescriptionText = new Konva.Text({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 340,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            text: 'Card description goes here...',
            fontSize: POPUP_STYLES.TEXT_FONT_SIZE,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
        });

       this.group.add(
            this.cardNameText, 
            imagePlaceholder, 
            this.cardImage,   
            this.cardCostText, 
            this.cardDescriptionText
        );
    }

    // implement interface method

   
    getGroup(): Group {
        return this.group;
    }

    
    show(card: Card): void {
       
        this.cardNameText.text(card.name);
        this.cardCostText.text(`Cost: ${card.cost}`);
        this.cardDescriptionText.text(card.description);

    
        Konva.Image.fromURL(card.imageUrl, (img) => {
            this.cardImage.image(img.image());
            // you may need to adjust image size here
            // this.cardImage.width(img.width());
            // this.cardImage.height(img.height());
        });


        this.group.visible(true);
    }

   
    hide(): void {
        this.group.visible(false);
    }
}