// src/screens/CardsScreen/TutorialPlayerPopup.ts

import Konva from 'konva';
import type { Group } from 'konva/lib/Group';
import type { ITutorialPlayerPopup, Card } from '../../types'; // 导入契约
import { SCREEN_WIDTH, SCREEN_HEIGHT, POPUP_STYLES } from '../../constants';


export class TutorialPlayerPopup implements ITutorialPlayerPopup {
    
    private group: Group;
    private tutorialImage: Konva.Image;
    private cardNameText: Konva.Text;
    private tutorialTitleText: Konva.Text;
    private tutorialDescriptionText: Konva.Text;

    constructor() {
        // create the main group
        this.group = new Konva.Group({
            visible: false, // 默认隐藏
            zIndex: 1000
        });

        //careate overlay
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            fill: POPUP_STYLES.OVERLAY_COLOR,
            opacity: POPUP_STYLES.OVERLAY_OPACITY
        });
        overlay.on('click', () => this.hide());
        this.group.add(overlay);

        // create popup window
        const windowWidth = 600;
        const windowHeight = 450;
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
            fill: POPUP_STYLES.TEXT_COLOR
        });
        closeBtn.on('click', () => this.hide());
        this.group.add(closeBtn);

        // create card name text
        this.cardNameText = new Konva.Text({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 40,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            text: 'Card Tutorial',
            fontSize: POPUP_STYLES.TITLE_FONT_SIZE,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
            align: 'center'
        });

        // create tutorial title text
        this.tutorialTitleText = new Konva.Text({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 80,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            text: 'Tutorial: How to Unlock This Card',
            fontSize: POPUP_STYLES.TEXT_FONT_SIZE + 2,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
            align: 'center',
            fontStyle: 'bold'
        });

        //create placeholder rectangle and tutorial image
        const placeholderRect = new Konva.Rect({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 120, 
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: 200,
            fill: '#ccc'
        });

        //  Konva.Image
        this.tutorialImage = new Konva.Image({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 120,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: 200,
            image: undefined // 必须有 image 属性
        });

        // create tutorial description text
        this.tutorialDescriptionText = new Konva.Text({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 340,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            text: 'Complete the tutorial to unlock this card and add it to your deck!',
            fontSize: POPUP_STYLES.TEXT_FONT_SIZE,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
            align: 'center'
        });

        this.group.add(
            this.cardNameText,
            this.tutorialTitleText,
            placeholderRect, 
            this.tutorialImage,
            this.tutorialDescriptionText
        );
    }

    // implement interface method

    getGroup(): Group {
        return this.group;
    }

    show(card: Card): void {
        // 更新文字内容
        this.cardNameText.text(`${card.name} Tutorial`);
        this.tutorialTitleText.text(`How to Unlock ${card.name}`);
        this.tutorialDescriptionText.text(`Complete the tutorial below to unlock ${card.name} and add it to your deck!`);

        // load tutorial image from path
        if (card.tutorial_path) {
            Konva.Image.fromURL(card.tutorial_path, (img) => {
                this.tutorialImage.image(img.image());
                this.group.getLayer()?.draw();
            });
        }

        // 显示组
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }
}