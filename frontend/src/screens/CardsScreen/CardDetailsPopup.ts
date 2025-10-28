// src/screens/CardsScreen/CardDetailsPopup.ts

import Konva from 'konva';
import type { Group } from 'konva/lib/Group';
import type { Card, ICardDetailsPopup } from '../../types'; // 导入契约
import { SCREEN_WIDTH, SCREEN_HEIGHT, POPUP_STYLES } from '../../constants';

/**
 * Ethan 的“卡片详情”弹窗组件
 * 它实现了 ICardDetailsPopup 接口，并使用 Konva 绘制
 */
export class CardDetailsPopup implements ICardDetailsPopup {
    
    private group: Group;
    
    // 弹窗内的 Konva 元素
    private cardNameText: Konva.Text;
    private cardImage: Konva.Image;
    private cardCostText: Konva.Text;
    private cardDescriptionText: Konva.Text;

    constructor() {
        // 1. 创建总组 (Group)，Huerter 将通过 getGroup() 获取它
        this.group = new Konva.Group({
            visible: false, // 默认隐藏
            zIndex: 1000     // 确保它在最上层
        });

        // 2. 创建一个全屏黑色半透明遮罩
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            fill: POPUP_STYLES.OVERLAY_COLOR,
            opacity: POPUP_STYLES.OVERLAY_OPACITY
        });
        // 点击遮罩时关闭弹窗
        overlay.on('click', () => this.hide());
        this.group.add(overlay);

        // 3. 创建弹窗的背景窗口
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

        // 4. 创建一个关闭按钮
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

        // 5. 创建用于显示内容的 Konva 节点 (先占位)
        // --- 卡片名称 ---
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
            fill: '#ccc' // 灰色占位符颜色
        });

        // 【已修复】 5.2: 创建 Konva.Image，它没有 'fill'，但需要 'image' 属性
        this.cardImage = new Konva.Image({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 80,
            width: windowWidth - (POPUP_STYLES.PADDING * 2),
            height: 200,
            image: undefined // 必须有 image 属性，即使是 undefined
        });

        // --- 卡片费用 ---
        this.cardCostText = new Konva.Text({
            x: windowX + POPUP_STYLES.PADDING,
            y: windowY + 300,
            text: 'Cost: ?',
            fontSize: POPUP_STYLES.TEXT_FONT_SIZE,
            fontFamily: POPUP_STYLES.FONT_FAMILY,
            fill: POPUP_STYLES.TEXT_COLOR,
        });

        // --- 卡片描述 ---
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
            imagePlaceholder, // 添加占位符
            this.cardImage,    // 添加图片层
            this.cardCostText, 
            this.cardDescriptionText
        );
    }

    // --- 实现接口要求的方法 ---

    /**
     * Huerter (或 Controller) 将调用此方法来获取你的弹窗组
     */
    getGroup(): Group {
        return this.group;
    }

    /**
     * Huerter (或 Controller) 将调用此方法来显示和填充弹窗
     */
    show(card: Card): void {
        // 1. 填充文本数据
        this.cardNameText.text(card.name);
        this.cardCostText.text(`Cost: ${card.cost}`);
        this.cardDescriptionText.text(card.description);

        // 2. 异步加载卡片图片
        Konva.Image.fromURL(card.imageUrl, (img) => {
            this.cardImage.image(img.image());
            // 可选：根据图片调整大小
            // this.cardImage.width(img.width());
            // this.cardImage.height(img.height());
        });

        // 3. 显示组
        this.group.visible(true);
    }

    /**
     * Huerter (或 Controller) 将调用此方法来隐藏弹窗
     */
    hide(): void {
        this.group.visible(false);
    }
}