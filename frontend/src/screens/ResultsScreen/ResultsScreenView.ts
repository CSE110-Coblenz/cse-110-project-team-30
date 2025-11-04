import Konva from "konva";
import type { View } from "../../types.ts";
//import type { LeaderboardEntry } from "./ResultsScreenModel.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * ResultsScreenView - Renders the results screen
 */
export class ResultsScreenView implements View {
  private group: Konva.Group;
  private finalScoreText: Konva.Text;
  private leaderboardText: Konva.Text;

  constructor(onHomeClick: () => void) {
    this.group = new Konva.Group({ visible: true });

    // Battle result title
    const title = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 100,
      text: "Result",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "red",
      align: "center",
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    const crownSize = 60;
    const playerCrownImage = new Image();
    playerCrownImage.src = "/results_images/teal_crown.png";
    playerCrownImage.onload = () => {
      const tealIcon = new Konva.Image({
        x: STAGE_WIDTH / 2 - 100,
        y: STAGE_HEIGHT / 2,
        width: crownSize,
        height: crownSize,
        image: playerCrownImage,
      });
      this.group.add(tealIcon);
      this.group.getLayer()?.draw();
    };

    const opponentCrownImage = new Image();
    opponentCrownImage.src = "/results_images/red_crown.png";
    opponentCrownImage.onload = () => {
      const redIcon = new Konva.Image({
        x: STAGE_WIDTH / 2 + 100,
        y: STAGE_HEIGHT / 2,
        width: crownSize,
        height: crownSize,
        image: opponentCrownImage,
      });
      this.group.add(redIcon);
      this.group.getLayer()?.draw();
    };

    // Final points display
    this.finalPointsText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 300,
      text: "Total Points Earned: +5",
      fontSize: 30,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.finalPointsText.offsetX(this.finalPointsText.width() / 2);
    this.group.add(this.finalPointsText);

    // Home button
    const homeButtonGroup = new Konva.Group();
    const homeButton = new Konva.Rect({
      x: 30,
      y: 30,
      width: 100,
      height: 35,
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

    const homeText = new Konva.Text({
      x: homeButton.x() + homeButton.width() / 2,
      y: homeButton.y() + homeButton.height() / 2,
      width: homeButton.width(),
      text: "Home",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#bfa24a", // gold
      align: "center",
    });
    homeText.offsetX(homeText.width() / 2);
    homeText.offsetY(homeText.height() / 2);

    homeButtonGroup.add(homeButton);
    homeButtonGroup.add(homeText);

    homeButtonGroup.on("click", onHomeClick);

    this.group.add(homeButtonGroup);
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
