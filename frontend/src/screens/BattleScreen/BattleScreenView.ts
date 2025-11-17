import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * BattleScreenView - Renders the battle game UI using Konva
 */
export class BattleScreenView implements View {
  private group: Konva.Group;
  private answerInput: HTMLInputElement;
  private remainderInput: HTMLInputElement;
  private timerText: Konva.Text;
  private crownText: Konva.Text;
  private selectedCardImages: Konva.Image[] = [];
  private readonly BATTLE_AREA_WIDTH: number = (STAGE_WIDTH / 3) * 2;
  private readonly BATTLE_AREA_HEIGHT: number = STAGE_HEIGHT;
  private readonly CARD_AREA_WIDTH: number =
    STAGE_WIDTH - this.BATTLE_AREA_WIDTH;
  private readonly CARD_AREA_HEIGHT: number = STAGE_HEIGHT;

  constructor(onHomeClick: () => void) {
    this.group = new Konva.Group({ visible: false });

    this.addBackground();
    this.addHomeButton(onHomeClick);

    this.battleFieldGroup = new Konva.Group({
      x: this.CARD_AREA_WIDTH,
      y: 0,
    });

    this.addBattleField();
    this.addTimerDisplay();
    const paddingX = 60;
    const paddingY = 60;
    this.addCrownsWithLabel(
      STAGE_WIDTH - paddingX,
      STAGE_HEIGHT / 2 - paddingY,
      "/results_images/red-crown.png",
      "0",
    );
    this.addCrownsWithLabel(
      STAGE_WIDTH - paddingX,
      STAGE_HEIGHT / 2 + paddingY,
      "/results_images/teal-crown.png",
      "0",
    );
    this.group.add(this.battleFieldGroup);

    this.cardsGroup = new Konva.Group({
      x: 0,
      y: 0,
    });

    this.loadPlaceholderCards();
    this.group.add(this.cardsGroup);
  }

  // Background
  private addBackground(): void {
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#87CEEB", // Sky blue
    });
    this.group.add(bg);
  }

  // only for testing
  private loadPlaceholderCards() {
    const cardsIds = [1, 2, 3, 4];
    this.loadCards(cardsIds);
  }

  private loadCards(cardsIds: string[] | number[]) {
    const cols = 2;
    const rows = 2;
    const padding = 60;

    const cardWidth = this.CARD_AREA_WIDTH / 4;
    const cardHeight = this.CARD_AREA_HEIGHT / 5;

    const gridWidth = cols * cardWidth + (cols - 1) * padding;
    const gridHeight = rows * cardHeight + (rows - 1) * padding;
    const startX = (this.CARD_AREA_WIDTH - gridWidth) / 2;
    const startY = this.CARD_AREA_HEIGHT - gridHeight;

    cardsIds.forEach((id, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      /*cardPaths.forEach((src, i) => {
    const imageObj = new Image();
    imageObj.src = src;

    imageObj.onload = () => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const card = new Konva.Image({
        image: imageObj,
        x: areaX + col * (cardWidth + padding),
        y: areaY + row * (cardHeight + padding),
        width: cardWidth,
        height: cardHeight,
        cornerRadius: 10,
      });

      this.group.add(card);
      this.group.getLayer()?.draw();
    };
  });*/

      const cards = new Konva.Group({
        x: startX + col * (cardWidth + padding),
        y: startY + row * (cardHeight + padding / 2),
      });

      const rect = new Konva.Rect({
        width: cardWidth,
        height: cardHeight,
        fill: "#ddd",
        stroke: "black",
        strokeWidth: 2,
        cornerRadius: 10,
      });

      const label = new Konva.Text({
        text: `Card ${id}`,
        width: cardWidth,
        height: cardHeight,
        align: "center",
        verticalAlign: "middle",
        fontSize: 22,
      });

      cards.add(rect);
      cards.add(label);

      this.cardsGroup.add(cards);
    });
    this.cardsGroup.getLayer()?.draw();
  }

  private addBattleField(): void {
    const cols = 16;
    const rows = 16;
    const margin = 20;

    const gridWidth = this.BATTLE_AREA_WIDTH - margin * 2;
    const gridHeight = this.BATTLE_AREA_HEIGHT - margin * 2;

    const tileWidth = gridWidth / cols;
    const tileHeight = gridHeight / rows;

    const field = new Konva.Group({ x: margin, y: margin });

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * tileWidth;
        const y = row * tileHeight;

        const tile = new Konva.Rect({
          x: x,
          y: y,
          width: tileWidth,
          height: tileHeight,
          fill: "white",
          stroke: "black",
          strokeWidth: 1,
        });
        field.add(tile);
      }
    }
    this.battleFieldGroup.add(field);
  }

  // Timer display (top-right)
  private addTimerDisplay(): void {
    const timerGroup = new Konva.Group();
    const timerRect = new Konva.Rect({
      x: this.BATTLE_AREA_WIDTH - 110,
      y: 20,
      width: 90,
      height: 50,
      fill: "white",
      cornerRadius: 5,
      opacity: 0.4,
    });
    timerGroup.add(timerRect);

    this.timerText = new Konva.Text({
      x: timerRect.x() + timerRect.width() / 2,
      y: timerRect.y() + timerRect.height() / 2,
      text: "Time left:\n0:00",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#960e29", // dark red
      align: "center",
    });
    this.timerText.offsetX(this.timerText.width() / 2);
    this.timerText.offsetY(this.timerText.height() / 2);
    timerGroup.add(this.timerText);

    this.battleFieldGroup.add(timerGroup);
  }

  // Home button
  private addHomeButton(onHomeClick: () => void): void {
    const homeGroup = new Konva.Group();
    const homeButton = new Konva.Group();
    const homeRect = new Konva.Rect({
      x: 20,
      y: 20,
      width: 110,
      height: 40,
      fill: "#004d4d", // dark teal
      cornerRadius: 10,
      strokeLinearGradientStartPoint: { x: 0, y: 0 },
      strokeLinearGradientEndPoint: { x: 200, y: 300 },
      strokeLinearGradientColorStops: [
        0,
        "#6b4c00",
        0.2,
        "#b08d36",
        0.4,
        "#fff8c4",
        0.6,
        "#d4af37",
        0.8,
        "#b08d36",
        1,
        "#6b4c00",
      ],
      shadowColor: "rgba(0,0,0,0.4)",
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      strokeWidth: 3,
    });
    homeButton.add(homeRect);

    const homeText = new Konva.Text({
      x: homeRect.x() + homeRect.width() / 2,
      y: homeRect.y() + homeRect.height() / 2,
      width: homeRect.width(),
      text: "Home",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#bfa24a", // gold
      align: "center",
    });
    homeText.offsetX(homeText.width() / 2);
    homeText.offsetY(homeText.height() / 2);
    homeButton.add(homeText);

    homeGroup.add(homeButton);
    homeButton.on("click", () => {
      this.showConfirmPopup(onHomeClick, () => {});
    });

    this.group.add(homeGroup);
  }

  // Pop-up for confirmation
  private showConfirmPopup(onQuit: () => void, onContinue: () => void): void {
    // prevent duplicate popups
    if (this.group.findOne(".confirm-popup")) return;

    const popupGroup = new Konva.Group({
      name: "confirm-popup",
    });

    const overlay = new Konva.Rect({
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "black",
      opacity: 0.4,
    });

    const popup = new Konva.Group({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
    });

    const popupRect = new Konva.Rect({
      width: 300,
      height: 120,
      fill: "white",
      cornerRadius: 10,
      shadowBlur: 10,
    });

    const popupText = new Konva.Text({
      x: popupRect.x() + popupRect.width() / 2,
      y: 40,
      text: "Are you sure you want to go home? Your battle progress will not be saved.",
      fontSize: 14,
      width: 250,
      verticalAlign: "middle",
    });
    popupText.offsetX(popupText.width() / 2);
    popupText.offsetY(popupText.height() / 2);

    const btnWidth = 110;
    const btnHeight = 30;
    const padding = 15;

    // YES button
    const yesBtn = new Konva.Rect({
      x: popupRect.width() / 2 + btnWidth / 2 + padding,
      y: popupRect.height() - 30,
      width: btnWidth,
      height: btnHeight,
      fill: "#004a3a",
      strokeLinearGradientStartPoint: { x: 0, y: 0 },
      strokeLinearGradientEndPoint: { x: 200, y: 500 },
      strokeLinearGradientColorStops: [
        0,
        "#6b4c00",
        0.2,
        "#b08d36",
        0.4,
        "#fff8c4",
        0.6,
        "#d4af37",
        0.8,
        "#b08d36",
        1,
        "#6b4c00",
      ],
      shadowColor: "rgba(0,0,0,0.4)",
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      strokeWidth: 2,
      cornerRadius: 10,
      cursor: "pointer",
    });
    yesBtn.offsetX(yesBtn.width() / 2);
    yesBtn.offsetY(yesBtn.height() / 2);

    const yesText = new Konva.Text({
      x: yesBtn.x(),
      y: yesBtn.y(),
      text: "Quit battle",
      fill: "#bfa24a", // gold
      fontSize: 14,
    });
    yesText.offsetX(yesText.width() / 2);
    yesText.offsetY(yesText.height() / 2);

    // NO button
    const noBtn = new Konva.Rect({
      x: popupRect.width() / 2 - btnWidth / 2 - padding,
      y: popupRect.height() - 30,
      width: btnWidth,
      height: btnHeight,
      fill: "#000080",
      strokeLinearGradientStartPoint: { x: 0, y: 0 },
      strokeLinearGradientEndPoint: { x: 200, y: 500 },
      strokeLinearGradientColorStops: [
        0,
        "#6b4c00",
        0.2,
        "#b08d36",
        0.4,
        "#fff8c4",
        0.6,
        "#d4af37",
        0.8,
        "#b08d36",
        1,
        "#6b4c00",
      ],
      shadowColor: "rgba(0,0,0,0.4)",
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      strokeWidth: 2,
      cornerRadius: 10,
      cursor: "pointer",
    });
    noBtn.offsetX(noBtn.width() / 2);
    noBtn.offsetY(noBtn.height() / 2);

    const noText = new Konva.Text({
      x: noBtn.x(),
      y: noBtn.y(),
      text: "Continue battle",
      fill: "#bfa24a", // gold
      fontSize: 14,
    });
    noText.offsetX(noText.width() / 2);
    noText.offsetY(noText.height() / 2);

    popup.add(popupRect, popupText, yesBtn, yesText, noBtn, noText);
    popup.offsetX(popup.width() / 2);
    popup.offsetY(popup.height() / 2);

    popupGroup.add(overlay, popup);
    this.group.add(popupGroup);

    // button actions
    yesBtn.on("click", () => {
      popup.destroy();
      overlay.destroy();
      layer.batchDraw();
      onQuit();
    });

    noBtn.on("click", () => {
      popup.destroy();
      overlay.destroy();
      layer.batchDraw();
      onContinue();
    });
  }

  // Score display in crowns
  private addCrownsWithLabel(x, y, imageURL, labelText) {
    const crownGroup = new Konva.Group();
    const crownWidth = 75;
    const crownHeight = 50;
    const crownImage = new Image();
    crownImage.src = imageURL;
    crownImage.onload = () => {
      const crown = new Konva.Image({
        x: x,
        y: y,
        width: crownWidth,
        height: crownHeight,
        image: crownImage,
      });
      crown.offsetX(crownWidth / 2);
      crown.offsetY(crownHeight / 2);
      crownGroup.add(crown);

      this.crownText = new Konva.Text({
        x: x,
        y: y + crownHeight / 2 + 5,
        width: crownWidth,
        text: labelText,
        fontSize: 20,
        fontFamily: "Arial",
        fill: "black",
        wrap: "word",
        align: "center",
      });
      this.crownText.offsetX(this.crownText.width() / 2);
      this.crownText.offsetY(this.crownText.height() / 2);
      crownGroup.add(this.crownText);

      this.group.add(crownGroup);
    };
  }

  private showMathPopup(
    problemText: string,
    correctAnswer: string,
    onQuit: () => void,
    onComplete: (
      isCorrect: boolean,
      answer: number,
      remainder?: number,
    ) => void,
  ): void {
    if (this.group.findOne(".math-popup")) return;

    const popupGroup = new Konva.Group({ name: "math-popup" });

    // overlay
    const overlay = new Konva.Rect({
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "black",
      opacity: 0.4,
    });
    popupGroup.add(overlay);

    const popupWidth = 400;
    const popupHeight = 200;
    const popup = new Konva.Group({
      x: STAGE_WIDTH / 2 - popupWidth / 2,
      y: STAGE_HEIGHT / 2 - popupHeight / 2,
    });

    const popupRect = new Konva.Rect({
      width: popupWidth,
      height: popupHeight,
      fill: "white",
      cornerRadius: 10,
      shadowBlur: 10,
    });
    popup.add(popupRect);

    const problem = new Konva.Text({
      x: 20,
      y: 20,
      width: popupWidth - 40,
      text: problemText,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    popup.add(problem);

    popupGroup.add(popup);
    this.group.add(popupGroup);
    this.group.getLayer()?.draw();

    // HTML input for answer
    const stageContainer = this.group.getStage()?.container();
    if (!stageContainer) return;

    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.width = `${popupWidth - 40}px`;
    input.style.left = `${stageContainer.offsetLeft + popup.x() + 20}px`;
    input.style.top = `${stageContainer.offsetTop + popup.y() + 70}px`;
    input.style.fontSize = "18px";
    input.style.padding = "5px";
    document.body.appendChild(input);
    input.focus();

    const buttonWidth = 120;
    const buttonHeight = 40;
    const padding = 20;

    // Quit button
    const quitBtn = new Konva.Rect({
      x: 20,
      y: popupHeight - buttonHeight - padding,
      width: buttonWidth,
      height: buttonHeight,
      fill: "#ff4d4d",
      cornerRadius: 5,
      cursor: "pointer",
    });
    const quitText = new Konva.Text({
      x: quitBtn.x() + buttonWidth / 2,
      y: quitBtn.y() + buttonHeight / 2,
      text: "Quit",
      fontSize: 18,
      fill: "white",
      align: "center",
    });
    quitText.offsetX(quitText.width() / 2);
    quitText.offsetY(quitText.height() / 2);
    popup.add(quitBtn, quitText);

    // Done button
    const doneBtn = new Konva.Rect({
      x: popupWidth - buttonWidth - 20,
      y: popupHeight - buttonHeight - padding,
      width: buttonWidth,
      height: buttonHeight,
      fill: "#4CAF50",
      cornerRadius: 5,
      cursor: "pointer",
    });
    const doneText = new Konva.Text({
      x: doneBtn.x() + buttonWidth / 2,
      y: doneBtn.y() + buttonHeight / 2,
      text: "Done",
      fontSize: 18,
      fill: "white",
      align: "center",
    });
    doneText.offsetX(doneText.width() / 2);
    doneText.offsetY(doneText.height() / 2);
    popup.add(doneBtn, doneText);

    this.group.getLayer()?.draw();

    // Button handlers
    quitBtn.on("click", () => {
      input.remove();
      popupGroup.destroy();
      this.group.getLayer()?.draw();
      onQuit();
    });

    doneBtn.on("click", () => {
      const answer = input.value.trim();
      const isCorrect = answer === correctAnswer;
      input.remove();
      popupGroup.destroy();
      this.group.getLayer()?.draw();

      // callback: if wrong, player moves on to next card
      onComplete(isCorrect, answer);
    });
  }

  /**
   * Update score display
   */
  /*updateScore(score: number): void {
    this.scoreText.text(`Score: ${score}`);
    this.group.getLayer()?.draw();
  }*/

  /**
   * Update timer display
   */
  updateTimer(timeRemaining: number): void {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    this.timerText.text(
      `Time left:\n${minutes}:${seconds.toString().padStart(2, "0")}`,
    );
    this.timerText.offsetX(this.timerText.width() / 2);
    this.timerText.offsetY(this.timerText.height() / 2);
    this.group.getLayer()?.draw();
  }

  showMathProblem(operation: string): void {
    if (operation === "division") {
      return;
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

  getGroup(): Konva.Group {
    return this.group;
  }
}
