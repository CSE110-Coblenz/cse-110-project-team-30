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
  private label: Konva.Text;
  private correctProblems: Konva.Text;
  private timerText: Konva.Text;

  constructor(
    onHomeClick: () => void,
    onContinueClick: () => void,
    onLeaveClick: () => void,
    onCardClick: (cardType: string) => void,
    onSubmitClick: (answer: number, remainder?: number) => void,
    onOkayClick: (location: string) => void,
  ) {
    this.group = new Konva.Group({ visible: false });
    this.addHomeButton(onHomeClick);
    this.addTimerDisplay();
    //this.addDragon();
  }

  // Timer display
  private addTimerDisplay(): void {
    const timerGroup = new Konva.Group();
    const timerWidth = 105;
    const timerHeight = 50;
    const timerRect = new Konva.Rect({
      x: STAGE_WIDTH - timerWidth - 20,
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

    this.group.add(timerGroup);
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
      onHomeClick();
    });
    this.group.add(homeButton);
  }

  // Home pop-up for confirmation
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

    const popupWidth = 320;
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

    const btnWidth = 135;
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
      popupGroup.destroy();
      onContinueClick();
    });
  }

  // Popup for math problem
  private showMathPopup(
    problemText: string,
    onSubmitClick: (answer: number) => void,
    onOkayClick: (location: string) => void,
    problemNumber: number,
    correctAnswers: number,
    totalProblems: number,
    minCorrectAnswers: number,
  ): void {
    if (this.group.findOne(".math-popup")) return;

    const popupWidth = (STAGE_WIDTH / 9) * 2;
    const popupHeight = STAGE_HEIGHT / 3;
    const mathPopup = new Konva.Group({
      name: "math-popup",
      x: (STAGE_WIDTH / 3) * 0.5 - popupWidth / 2,
      y: STAGE_HEIGHT / 1.75 - popupHeight / 2,
    });

    const popupRect = new Konva.Rect({
      width: popupWidth,
      height: popupHeight,
      fill: "white",
      stroke: "gray",
      strokeWidth: 1,
      cornerRadius: 10,
    });
    mathPopup.add(popupRect);

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
    mathPopup.add(problem);

    this.label = new Konva.Text({
      x: 0,
      y: problem.y() + problem.height() + txtPadding * 2,
      width: popupWidth,
      text: "Enter the answer for the expression: ",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    mathPopup.add(this.label);

    const inpWidth = popupWidth / 4;
    // HTML input for answer
    const rectPos = popupRect.getClientRect();
    this.answerInput = document.createElement("input");
    this.answerInput.type = "text";
    this.answerInput.placeholder = "Answer";
    this.answerInput.style.position = "absolute";
    this.answerInput.style.left = `${rectPos.x + rectPos.width / 2 - inpWidth / 2}px`;
    this.answerInput.style.top = `${rectPos.y + rectPos.height * 0.45}px`;
    this.answerInput.style.width = `${inpWidth}px`;
    this.answerInput.style.fontSize = "18px";
    this.answerInput.style.padding = "5px";
    this.answerInput.style.border = "2px solid black";
    this.answerInput.style.borderRadius = "5px";
    document.body.appendChild(this.answerInput);

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

    const statusPopup = this.showStatusPopup(
      problemNumber,
      correctAnswers,
      totalProblems,
      minCorrectAnswers,
    );
    mathPopup.add(submitBtn, okayBtn, statusPopup);
    this.group.add(mathPopup);

    // Button handlers
    submitBtn.on("click", () => {
      const answer = parseFloat(this.answerInput.value.trim());
      this.answerInput.remove();
      onSubmitClick(answer);
      submitBtn.visible(false);
      okayBtn.visible(true);
    });

    okayBtn.on("click", () => {
      mathPopup.destroy();
      onOkayClick("problem");
    });
  }

  /**
   * Shows the user the current problem they're at
   * and the number of problems they got correct
   */
  private showStatusPopup(
    problemNumber: number,
    correctAnswers: number,
    totalProblems: number,
    minCorrectAnswers: number,
  ) {
    if (this.group.findOne(".status-popup")) return;

    const popupWidth = (STAGE_WIDTH / 9) * 2;
    const popupHeight = STAGE_HEIGHT / 8;
    const popup = new Konva.Group({
      name: "status-popup",
      x: 0,
      y: (-popupHeight / 2) * 3,
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

    const txtPadding = 30;
    const currentProblem = new Konva.Text({
      x: 0,
      y: popupHeight / 2 - txtPadding,
      width: popupWidth,
      text: `Current problem: #${problemNumber}`,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    currentProblem.offsetY(currentProblem.height() / 2);

    this.correctProblems = new Konva.Text({
      x: 0,
      y: popupHeight / 2 + txtPadding / 2,
      width: popupWidth,
      text: `Questions answered correctly: ${correctAnswers} out of ${totalProblems}`,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.correctProblems.offsetY(this.correctProblems.height() / 2);

    const message = new Konva.Text({
      x: 0,
      y: this.correctProblems.y() + txtPadding / 1.5,
      width: popupWidth,
      text: `*Must get ${minCorrectAnswers} out of ${totalProblems} correct to tame the dragon.`,
      fontSize: 14,
      fontFamily: "Arial",
      fill: "red",
      align: "center",
    });
    message.offsetY(message.height() / 2);
    popup.add(currentProblem, this.correctProblems, message);

    return popup;
  }

  /**
   * Update math problem label as feedback
   */
  showFeedback(answer: number, isCorrect: boolean): void {
    console.log("entered showfeedback");
    const prefix = isCorrect ? "Correct!" : "Incorrect.";
    this.label.text(`${prefix} The answer is ${answer}.`);
    this.group.getLayer()?.draw();
  }

  /**
   * Update status label with new info
   */
  showStatusUpdate(totalProblems: number, correctAnswers: number): void {
    console.log("entered showStatusUpdate");
    this.correctProblems.text(
      `Questions answered correctly: ${correctAnswers} out of ${totalProblems}`,
    );
    this.group.getLayer()?.draw();
  }

  private showResultsPopup(
    outcome: string = "win" | "lose",
    onOkayClick: (location: string) => void,
    totalProblems: number,
    minCorrectAnswers: number,
  ): void {
    if (this.group.findOne(".results-popup")) return;

    const popupWidth = 420;
    const popupHeight = 200;
    const popup = new Konva.Group({
      name: "results-popup",
    });

    const overlay = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "black",
      opacity: 0.4,
    });
    popup.add(overlay);

    const popupRect = new Konva.Rect({
      x: STAGE_WIDTH / 2 - popupWidth / 2,
      y: STAGE_HEIGHT / 2 - popupHeight / 2,
      width: popupWidth,
      height: popupHeight,
      fill: "white",
      cornerRadius: 10,
      shadowBlur: 10,
    });
    popup.add(popupRect);

    let labelText = "";
    switch (outcome) {
      case "win":
        labelText = "You tamed the dragon! Good job!";
        break;
      case "lose":
        labelText = `You were not able to tame the dragon. You needed to get ${minCorrectAnswers} out of ${totalProblems} questions correct before time runs out.`;
        break;
    }

    const label = new Konva.Text({
      x: popupRect.x() + popupWidth / 2,
      y: popupRect.y() + 80,
      width: (popupWidth / 4) * 3.5,
      text: labelText,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    label.offsetX(label.width() / 2);
    label.offsetY(label.height() / 2);
    popup.add(label);

    const buttonWidth = 100;
    const buttonHeight = 35;
    const btnPadding = 20;

    // Okay button
    const okayBtn = new Konva.Group();
    const okayRect = new Konva.Rect({
      x: popupRect.x() + popupWidth / 2 - buttonWidth / 2,
      y: popupRect.y() + popupHeight - buttonHeight - btnPadding,
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
    popup.add(okayBtn);
    this.group.add(popup);

    // Button handler
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
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
