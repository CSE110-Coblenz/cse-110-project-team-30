import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { MinigameScreenModel } from "./MinigameScreenModel.ts";

/**
 * MinigameScreenView - Renders the minigame UI using Konva
 */
export class MinigameScreenView implements View {
  private group: Konva.Group;
  private answerInput: HTMLInputElement;
  private remainderInput: HTMLInputElement | null = null;
  private label: Konva.Text;
  private timerText: Konva.Text;
  private readonly MINIGAME_AREA_WIDTH: number = (STAGE_WIDTH / 3) * 2;
  private readonly MINIGAME_AREA_HEIGHT: number = STAGE_HEIGHT;
  private readonly CARD_AREA_WIDTH: number =
    STAGE_WIDTH - this.MINIGAME_AREA_WIDTH;
  private readonly CARD_AREA_HEIGHT: number = STAGE_HEIGHT;

  constructor(
    onHomeClick: () => void,
    onContinueClick: () => void,
    onLeaveClick: () => void,
    onCardClick: (cardType: string) => void,
    onSubmitClick: (answer: number, remainder?: number) => void,
    onOkayClick: () => void,
  ) {
    //true for testing
    this.group = new Konva.Group({ visible: true });
    this.addBackground();
    this.addHomeButton(onHomeClick);

    this.minigameFieldGroup = new Konva.Group({
      x: this.CARD_AREA_WIDTH,
      y: 0,
    });

    this.addTimerDisplay();
    this.addDragon();
    this.group.add(this.minigameFieldGroup);

    this.cardsGroup = new Konva.Group({
      x: 0,
      y: 0,
    });

    this.group.add(this.cardsGroup);
  }

  // Background
  private addBackground(): void {
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#C8F0F0", // pastel cyan
    });
    this.group.add(bg);
  }

  private addDragon() {
    console.log("Adding dragon...");
  }

  // Timer display
  private addTimerDisplay(): void {
    const timerGroup = new Konva.Group();
    const timerWidth = 105;
    const timerHeight = 50;
    const timerRect = new Konva.Rect({
      x: -timerWidth,
      y: 20,
      width: timerWidth,
      height: timerHeight,
      fill: "white",
      cornerRadius: 10,
      strokeLinearGradientStartPoint: { x: 0, y: 0 },
      strokeLinearGradientEndPoint: { x: 100, y: 300 },
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
    timerGroup.add(timerRect);

    this.timerText = new Konva.Text({
      x: timerRect.x() + timerWidth / 2,
      y: timerRect.y() + timerHeight / 2,
      text: "Time left:\n0:00",
      fontSize: 19,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.timerText.offsetX(this.timerText.width() / 2);
    this.timerText.offsetY(this.timerText.height() / 2);
    timerGroup.add(this.timerText);

    this.minigameFieldGroup.add(timerGroup);
  }

  // Home button
  private addHomeButton(onHomeClick: () => void): void {
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

    homeButton.on("click", () => {
      if (this.answerInput) this.answerInput.style.display = "none";
      if (this.remainderInput) this.remainderInput.style.display = "none";
      onHomeClick();
    });
    this.group.add(homeButton);
  }

  // Pop-up for confirmation
  private showConfirmPopup(
    onLeaveClick: () => void,
    onContinueClick: () => void,
  ) {
    // prevent duplicate popups
    if (this.group.findOne(".confirm-popup")) return;

    const popupGroup = new Konva.Group({
      name: "confirm-popup",
    });

    const overlay = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "black",
      opacity: 0.7,
    });

    const popupWidth = 300;
    const popupHeight = 160;
    const popup = new Konva.Group();

    const popupRect = new Konva.Rect({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      width: popupWidth,
      height: popupHeight,
      fill: "white",
      cornerRadius: 10,
      shadowBlur: 10,
    });
    popupRect.offsetX(popupRect.width() / 2);
    popupRect.offsetY(popupRect.height() / 2);

    const popupText = new Konva.Text({
      x: popupRect.x(),
      y: popupRect.y() - popupHeight / 4.5,
      text: "Are you sure you want to go home? Your minigame progress will not be saved.",
      fontSize: 16,
      width: popupWidth - 40,
      verticalAlign: "middle",
    });
    popupText.offsetX(popupText.width() / 2);
    popupText.offsetY(popupText.height() / 2);

    const btnWidth = 120;
    const btnHeight = 35;
    const padding = 15;

    // Leave Minigame/Yes button
    const yesBtn = new Konva.Group();
    const yesRect = new Konva.Rect({
      x: popupRect.x() + btnWidth / 2 + padding,
      y: popupRect.y() + popupHeight / 4,
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
    yesRect.offsetX(yesRect.width() / 2);
    yesRect.offsetY(yesRect.height() / 2);
    yesBtn.add(yesRect);

    const yesText = new Konva.Text({
      x: yesRect.x(),
      y: yesRect.y(),
      text: "Leave Minigame",
      fill: "#bfa24a", // gold
      fontSize: 16,
    });
    yesText.offsetX(yesText.width() / 2);
    yesText.offsetY(yesText.height() / 2);
    yesBtn.add(yesText);

    // Keeping Playing/No button
    const noBtn = new Konva.Group();
    const noRect = new Konva.Rect({
      x: popupRect.x() - btnWidth / 2 - padding,
      y: popupRect.y() + popupHeight / 4,
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
    noRect.offsetX(noRect.width() / 2);
    noRect.offsetY(noRect.height() / 2);
    noBtn.add(noRect);

    const noText = new Konva.Text({
      x: noRect.x(),
      y: noRect.y(),
      text: "Keep Playing",
      fill: "#bfa24a", // gold
      fontSize: 16,
    });
    noText.offsetX(noText.width() / 2);
    noText.offsetY(noText.height() / 2);
    noBtn.add(noText);

    popup.add(popupRect, popupText, yesBtn, noBtn);

    popupGroup.add(overlay, popup);
    this.group.add(popupGroup);

    // button actions
    yesBtn.on("click", () => {
      console.log("Leave button clicked");
      popupGroup.destroy();
      onLeaveClick();
    });

    noBtn.on("click", () => {
      console.log("Continue button clicked");
      if (this.answerInput) this.answerInput.style.display = "block";
      if (this.remainderInput) this.remainderInput.style.display = "block";
      popupGroup.destroy();
      onContinueClick();
    });
  }

  // Popup for math problem
  private showMathPopup(
    problemText: string,
    onSubmitClick: (answer: number, remainder: number) => void,
    onOkayClick: (location: string) => void,
  ): void {
    if (this.group.findOne(".math-popup")) return;

    const popupWidth = (this.CARD_AREA_WIDTH / 4) * 3;
    const popupHeight = this.CARD_AREA_HEIGHT / 3;
    const popup = new Konva.Group({
      name: "math-popup",
      x: this.CARD_AREA_WIDTH / 2 - popupWidth / 2,
      y: this.CARD_AREA_HEIGHT / 3.5 - popupHeight / 2,
    });

    const popupRect = new Konva.Rect({
      width: popupWidth,
      height: popupHeight,
      fill: "white",
      stroke: "gray",
      strokeWidth: 1,
      cornerRadius: 10,
    });
    popup.add(popupRect);

    const txtPadding = 20;
    const problem = new Konva.Text({
      x: 0,
      y: txtPadding * 2,
      width: popupWidth,
      text: problemText,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    popup.add(problem);

    let labelText =
      "Enter the answer and remainder (0 if none) for the expression: ";
    let placeholderAnswer = "Answer";
    let placeholderRemainder = "Remainder";

    this.label = new Konva.Text({
      x: 0,
      y: problem.y() + problem.height() + txtPadding * 2,
      width: popupWidth,
      text: labelText,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    popup.add(this.label);

    const inpWidth = popupWidth / 4;
    // HTML input for answer
    const rectPos = popupRect.getClientRect();
    this.answerInput = document.createElement("input");
    this.answerInput.type = "text";
    this.answerInput.placeholder = placeholderAnswer;
    this.answerInput.style.position = "absolute";
    this.answerInput.style.left = `${rectPos.x + rectPos.width / 2 - inpWidth / 2}px`;
    this.answerInput.style.top = `${rectPos.y + rectPos.height * 0.45}px`;
    this.answerInput.style.width = `${inpWidth}px`;
    this.answerInput.style.fontSize = "18px";
    this.answerInput.style.padding = "5px";
    this.answerInput.style.border = "2px solid black";
    this.answerInput.style.borderRadius = "5px";
    document.body.appendChild(this.answerInput);

    this.remainderInput = document.createElement("input");
    this.remainderInput.type = "text";
    this.remainderInput.placeholder = placeholderRemainder;
    this.remainderInput.style.position = "absolute";
    this.remainderInput.style.left = `${rectPos.x + rectPos.width / 2 - inpWidth / 2}px`;
    this.remainderInput.style.top = `${rectPos.y + rectPos.height * 0.65}px`;
    this.remainderInput.style.width = `${inpWidth}px`;
    this.remainderInput.style.fontSize = "18px";
    this.remainderInput.style.padding = "5px";
    this.remainderInput.style.border = "2px solid black";
    this.remainderInput.style.borderRadius = "5px";
    document.body.appendChild(this.remainderInput);

    const buttonWidth = 140;
    const buttonHeight = 35;
    const btnPadding = 20;

    // Submit button
    const submitBtn = new Konva.Group();
    const submitRect = new Konva.Rect({
      x: popupWidth / 2 - buttonWidth / 2,
      y: popupHeight - buttonHeight - btnPadding,
      width: buttonWidth,
      height: buttonHeight,
      fill: "#004000", // dark green
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
      strokeWidth: 3,
      cornerRadius: 10,
      cursor: "pointer",
    });

    const submitText = new Konva.Text({
      x: submitRect.x() + buttonWidth / 2,
      y: submitRect.y() + buttonHeight / 2,
      text: "Check Answer",
      fontSize: 18,
      fill: "#bfa24a", // gold
      align: "center",
    });
    submitText.offsetX(submitText.width() / 2);
    submitText.offsetY(submitText.height() / 2);
    submitBtn.add(submitRect, submitText);

    // Okay button
    const okayBtn = new Konva.Group();
    const okayRect = new Konva.Rect({
      x: popupWidth / 2 - buttonWidth / 2,
      y: popupHeight - buttonHeight - btnPadding,
      width: buttonWidth,
      height: buttonHeight,
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

    const okayText = new Konva.Text({
      x: okayRect.x() + buttonWidth / 2,
      y: okayRect.y() + buttonHeight / 2,
      text: "Okay",
      fontSize: 18,
      fill: "#bfa24a", // gold
      align: "center",
    });
    okayText.offsetX(okayText.width() / 2);
    okayText.offsetY(okayText.height() / 2);
    okayBtn.add(okayRect, okayText);
    okayBtn.visible(false);

    popup.add(submitBtn, okayBtn);
    this.group.add(popup);

    // Button handlers
    submitBtn.on("click", () => {
      const answer = parseFloat(this.answerInput.value.trim());
      const remainder = parseFloat(this.remainderInput.value.trim());
      this.answerInput.remove();
      this.remainderInput.remove();
      onSubmitClick(answer, remainder);
      submitBtn.visible(false);
      okayBtn.visible(true);
    });

    okayBtn.on("click", () => {
      popup.destroy();
      onOkayClick("problem");
    });
  }

  /**
   * Update math problem label as feedback
   */
  showFeedback(answer: number, remainder: number, isCorrect: boolean): void {
    console.log(`entered showfeedback with operation: ${operation}`);
    const prefix = isCorrect ? "Correct!" : "Incorrect.";
    this.label.text(
      `${prefix} The answer is ${answer}, and the remainder is ${remainder}.`,
    );
    this.group.getLayer()?.draw();
  }

  private showResultsPopup(
    outcome: string = "win" | "lose",
    onOkayClick: (location: string) => void,
  ): void {
    if (this.group.findOne(".results-popup")) return;

    const popupWidth = (this.CARD_AREA_WIDTH / 4) * 3;
    const popupHeight = this.CARD_AREA_HEIGHT / 3;
    const popup = new Konva.Group({
      name: "results-popup",
      x: this.CARD_AREA_WIDTH / 2 - popupWidth / 2,
      y: this.CARD_AREA_HEIGHT / 3.5 - popupHeight / 2,
    });

    const popupRect = new Konva.Rect({
      width: popupWidth,
      height: popupHeight,
      fill: "white",
      stroke: "gray",
      strokeWidth: 1,
      cornerRadius: 10,
    });
    popup.add(popupRect);

    const txtPadding = 20;
    const problem = new Konva.Text({
      x: 0,
      y: txtPadding * 2,
      width: popupWidth,
      text: problemText,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    popup.add(problem);

    let labelText = "";
    if (outcome === "win") {
      labelText = "You tamed the dragon! Good job!";
    } else {
      labelText =
        "You were not able to tame the dragon. You needed to get 5 out of 8 questions correct.";
    }

    this.label = new Konva.Text({
      x: 0,
      y: problem.y() + problem.height() + txtPadding * 2,
      width: popupWidth,
      text: labelText,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    popup.add(this.label);

    // Okay button
    const okayBtn = new Konva.Group();
    const okayRect = new Konva.Rect({
      x: popupWidth / 2 - buttonWidth / 2,
      y: popupHeight - buttonHeight - btnPadding,
      width: buttonWidth,
      height: buttonHeight,
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

    const okayText = new Konva.Text({
      x: okayRect.x() + buttonWidth / 2,
      y: okayRect.y() + buttonHeight / 2,
      text: "Okay",
      fontSize: 18,
      fill: "#bfa24a", // gold
      align: "center",
    });
    okayText.offsetX(okayText.width() / 2);
    okayText.offsetY(okayText.height() / 2);
    okayBtn.add(okayRect, okayText);
    okayBtn.visible(false);

    popup.add(submitBtn, okayBtn);
    this.group.add(popup);

    // Button handlers
    submitBtn.on("click", () => {
      const answer = parseFloat(this.answerInput.value.trim());
      const remainder = parseFloat(this.remainderInput.value.trim());
      this.answerInput.remove();
      this.remainderInput.remove();
      onSubmitClick(answer, remainder);
      submitBtn.visible(false);
      okayBtn.visible(true);
    });

    okayBtn.on("click", () => {
      popup.destroy();
      onOkayClick("results");
    });
  }

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
    if (this.answerInput) this.answerInput.style.display = "none";
    if (this.remainderInput) this.remainderInput.style.display = "none";
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
