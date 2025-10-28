// src/screens/CardsScreen/TutorialPlayerPopup.ts

import Konva from 'konva';
import type { Group } from 'konva/lib/Group';
import type { ITutorialPlayerPopup } from '../../types'; // 导入契约
import { SCREEN_WIDTH, SCREEN_HEIGHT, POPUP_STYLES } from '../../constants';


export class TutorialPlayerPopup implements ITutorialPlayerPopup {
    
    private group: Group;
    private tutorialImage: Konva.Image;

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

        //create placeholder rectangle and tutorial image
     const placeholderRect = new Konva.Rect({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + POPUP_STYLES.PADDING + 30, 
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: windowHeight - (POPUP_STYLES.PADDING * 2) - 30,
            fill: '#ccc'
        });

        //  Konva.Image
        this.tutorialImage = new Konva.Image({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + POPUP_STYLES.PADDING + 30,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: windowHeight - (POPUP_STYLES.PADDING * 2) - 30,
            image: undefined // 必须有 image 属性
        });
        this.group.add(placeholderRect, this.tutorialImage);
    }

    // implement interface method

    getGroup(): Group {
        return this.group;
    }

    show(tutorialPath: string): void {
        // load tutorial image from path
        Konva.Image.fromURL(tutorialPath, (img) => {
            this.tutorialImage.image(img.image());
            
        });

        // 2. 显示组
        this.group.visible(true);
    }

    hide(): void {
        this.group.visible(false);
    }
}