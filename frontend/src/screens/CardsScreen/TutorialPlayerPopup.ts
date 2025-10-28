// src/screens/CardsScreen/TutorialPlayerPopup.ts

import Konva from 'konva';
import type { Group } from 'konva/lib/Group';
import type { ITutorialPlayerPopup } from '../../types'; // 导入契约
import { SCREEN_WIDTH, SCREEN_HEIGHT, POPUP_STYLES } from '../../constants';

/**
 * Ethan 的“教程”弹窗组件
 * 它实现了 ITutorialPlayerPopup 接口
 * (假设教程是一张图片)
 */
export class TutorialPlayerPopup implements ITutorialPlayerPopup {
    
    private group: Group;
    private tutorialImage: Konva.Image;

    constructor() {
        // 1. 创建总组
        this.group = new Konva.Group({
            visible: false, // 默认隐藏
            zIndex: 1000
        });

        // 2. 创建遮罩
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

        // 3. 创建弹窗背景 (让它大一点以适应教程图片)
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

        // 4. 创建关闭按钮
        const closeBtn = new Konva.Text({
            x: windowX + windowWidth - POPUP_STYLES.PADDING - 10,
            y: windowY + POPUP_STYLES.PADDING,
            text: 'X',
            fontSize: 20,
            fill: POPUP_STYLES.TEXT_COLOR
        });
        closeBtn.on('click', () => this.hide());
        this.group.add(closeBtn);

        // 5. 创建教程图片占位符
     const placeholderRect = new Konva.Rect({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + POPUP_STYLES.PADDING + 30, // 在关闭按钮下方
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: windowHeight - (POPUP_STYLES.PADDING * 2) - 30,
            fill: '#ccc'
        });

        // 【已修复】 5.2: 创建 Konva.Image
        this.tutorialImage = new Konva.Image({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + POPUP_STYLES.PADDING + 30,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: windowHeight - (POPUP_STYLES.PADDING * 2) - 30,
            image: undefined // 必须有 image 属性
        });
        this.group.add(placeholderRect, this.tutorialImage);
    }

    // --- 实现接口要求的方法 ---

    getGroup(): Group {
        return this.group;
    }

    show(tutorialPath: string): void {
        // 1. 异步加载教程图片
        Konva.Image.fromURL(tutorialPath, (img) => {
            this.tutorialImage.image(img.image());
            // (你可能需要调整图片的宽高比)
        });

        // 2. 显示组
        this.group.visible(true);
    }

    hide(): void {
        this.group.visible(false);
    }
}