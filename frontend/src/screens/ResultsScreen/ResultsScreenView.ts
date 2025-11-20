import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * ResultsScreenView - Renders the results screen
 */
export class ResultsScreenView implements View {
  private group: Konva.Group;
  private resultText: Konva.Text;
  private pointsText: Konva.Text;
  private statsText: Konva.Text;

  constructor(onClick: () => void) {
    this.group = new Konva.Group({ visible: false });

    // Background
    const background = new Konva.Rect({
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#e6f0ff", // sky blue
    });
    this.group.add(background);

    // Result text
    this.resultText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 30,
      text: "",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.resultText.offsetX(this.resultText.width() / 2);
    this.group.add(this.resultText);

    // Crowns display
    const totalCrowns = 3;
    const playerEarned = 1; //this.model.getPlayerCastles();
    const opponentEarned = 2; //this.model.getOpponentCastles();
    const crownWidth = 140;
    const crownHeight = 110;
    const spacing = 90;

    // Player crowns
    const playerStartX =
      STAGE_WIDTH / 2 -
      (crownWidth * totalCrowns + (totalCrowns - 1) * spacing) / 2;
    const playerY = STAGE_HEIGHT / 2 - 300;

    const playerCrownGroup = new Konva.Group();

    for (let i = 0; i < totalCrowns; i++) {
      const playerCrownImage = new Image();
      playerCrownImage.src = "/results_images/teal-crown.png";
      playerCrownImage.onload = () => {
        const tealCrown = new Konva.Image({
          x: playerStartX + i * (crownWidth + spacing),
          y: playerY,
          width: crownWidth,
          height: crownHeight,
          image: playerCrownImage,
          opacity: i < playerEarned ? 1 : 0.3,
        });
        playerCrownGroup.add(tealCrown);
      };
    }
    this.group.add(playerCrownGroup);

    // Opponent crowns
    const opponentStartX =
      STAGE_WIDTH / 2 -
      (crownWidth * totalCrowns + (totalCrowns - 1) * spacing) / 2;
    const opponentStartY = STAGE_HEIGHT / 2;

    const opponentCrownGroup = new Konva.Group();

    for (let i = 0; i < totalCrowns; i++) {
      const opponentCrownImage = new Image();
      opponentCrownImage.src = "/results_images/red-crown.png";
      opponentCrownImage.onload = () => {
        const redCrown = new Konva.Image({
          x: opponentStartX + i * (crownWidth + spacing),
          y: opponentStartY,
          width: crownWidth,
          height: crownHeight,
          image: opponentCrownImage,
          opacity: i < opponentEarned ? 1 : 0.3,
        });
        opponentCrownGroup.add(redCrown);
      };
    }
    this.group.add(opponentCrownGroup);

    // Stats text
    this.statsText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 180,
      text: "",
      fontSize: 30,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.statsText.offsetX(this.statsText.width() / 2);
    this.group.add(this.statsText);

    // Points text
    this.pointsText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 170,
      text: "",
      fontSize: 30,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.pointsText.offsetX(this.pointsText.width() / 2);
    this.group.add(this.pointsText);

    // Okay button
    const buttonGroup = new Konva.Group();
    const button = new Konva.Rect({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 310,
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
    button.offsetX(button.width() / 2);
    button.offsetY(button.height() / 2);

    const buttonText = new Konva.Text({
      x: button.x(),
      y: button.y(),
      width: button.width(),
      text: "Okay",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#bfa24a", // gold
      align: "center",
    });
    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);

    buttonGroup.add(button);
    buttonGroup.add(buttonText);

    buttonGroup.on("click", onClick);

    this.group.add(buttonGroup);

    //placeholder values in updateText
    //  this.model.subscribe((result: "win" | "loss" | "draw", playerCastles: number, opponentCastles: number, pointsUpdate: number) => this.updateText("draw", 0, 0, 0));
    this.updateText("draw", 0, 0, 0);
  }

  /**
   * Update various text displays
   */
  updateText(
    result: "win" | "loss" | "draw",
    playerCastles: number,
    opponentCastles: number,
    pointsUpdate: number,
  ): void {
    let resultColor = "#004d4d";
    let resultMsg = "";
    let textMsg = "";

    switch (result) {
      case "win":
        resultMsg = "Victory!";
        resultColor = "#004d4d"; // dark teal
        textMsg = `Points: +${pointsUpdate}`;
        break;
      case "loss":
        resultMsg = "Defeat";
        ((resultColor = "#960e29"), // dark red
          (textMsg = `Points: -${pointsUpdate}`));
        break;
      case "draw":
        resultMsg = "Draw";
        ((resultColor = "#220135"), // dark purple
          (textMsg = `Points: ${pointsUpdate}`));
        break;
    }

    this.resultText.fill(resultColor);
    this.resultText.text(resultMsg);
    this.resultText.offsetX(this.resultText.width() / 2);

    this.statsText.text(`${playerCastles}\n\nvs\n\n${opponentCastles}`);
    this.statsText.offsetX(this.statsText.width() / 2);

    this.pointsText.text(textMsg);
    this.pointsText.offsetX(this.pointsText.width() / 2);

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
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
