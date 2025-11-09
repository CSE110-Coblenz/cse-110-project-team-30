import Konva from "konva";
import type { View } from "../../types.ts";
import { PlayerModel } from "../../PlayerModel";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MenuScreenView implements View {
  private group: Konva.Group;
  private pointsText: Konva.Text;

  constructor(
    private model: PlayerModel,
    private onButtonClick: (id: string) => void,
  ) {
    this.group = new Konva.Group({ visible: false });

    // Background Image
    const backgroundImage = new Image();
    backgroundImage.src = "menu_images/menu_background.png";
    backgroundImage.onload = () => {
      const bg = new Konva.Image({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        image: backgroundImage,
        opacity: 0.6,
      });
      this.group.add(bg);
      bg.moveToBottom();
    };

    // Title text
    const title = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 30,
      text: "Welcome!",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "#004d4d", // dark teal
      stroke: "#004d4d", // dark teal
      strokeWidth: 2,
      align: "center",
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // Display points
    const padding = 5;
    const pointsGroup = new Konva.Group({ x: 10, y: 10 });
    const pointsImage = new Konva.Image({
      x: 0,
      y: 0,
      width: 75,
      height: 75,
    });

    const pointsImgObj = new Image();
    pointsImgObj.src = "/menu_images/points.png";
    pointsImgObj.onload = () => {
      pointsImage.image(pointsImgObj);
      this.group.getLayer()?.draw();
    };
    pointsGroup.add(pointsImage);

    this.pointsText = new Konva.Text({
      x: pointsImage.x() + pointsImage.width() / 2,
      y: pointsImage.y() + pointsImage.height() + padding,
      width: pointsImage.width(),
      text: `Points: ${this.model.getTotalPoints()}`,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
      wrap: "word",
    });
    pointsGroup.add(this.pointsText);
    this.pointsText.offsetX(this.pointsText.width() / 2);

    this.group.add(pointsGroup);

    // Create buttons helper
    const createButton = (btn: {
      id: string;
      label: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
    }): Konva.Group => {
      if (btn.id === "leaderboard") {
        const leaderboardGroup = new Konva.Group({ x: btn.x, y: btn.y });
        const imgWidth = btn.width;
        const imgHeight = btn.height;
        const leaderboardImage = new Konva.Image({
          width: imgWidth,
          height: imgHeight,
        });
        const lbImgObj = new Image();
        lbImgObj.src = "/menu_images/leaderboard.png";
        lbImgObj.onload = () => {
          leaderboardImage.image(lbImgObj);
          leaderboardGroup.getLayer()?.draw();
        };
        leaderboardImage.x(imgWidth / 2);
        leaderboardImage.offsetX(imgWidth / 2);
        leaderboardGroup.add(leaderboardImage);

        const leaderboardText = new Konva.Text({
          x: imgWidth / 2,
          y: imgHeight + padding,
          text: btn.label,
          fontSize: 18,
          fontFamily: "Arial",
          fill: "black",
        });
        leaderboardText.offsetX(leaderboardText.width() / 2);
        leaderboardGroup.add(leaderboardText);

        const groupWidth = Math.max(imgWidth, leaderboardText.width());
        const groupHeight = imgHeight + padding + leaderboardText.height();

        leaderboardGroup.offsetX(groupWidth / 2);
        leaderboardGroup.offsetY(groupHeight / 2);

        leaderboardGroup.on("click", () => this.onButtonClick(btn.id));
        return leaderboardGroup;
      }
      const btnGroup = new Konva.Group({ x: btn.x, y: btn.y });
      const btnRect = new Konva.Rect({
        width: btn.width,
        height: btn.height,
        fill: btn.fill,
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
      });
      btnGroup.add(btnRect);

      const btnText = new Konva.Text({
        text: btn.label,
        fontSize: 20,
        fontFamily: "Arial",
        width: btn.width,
        height: btn.height,
        fill: "#bfa24a", // gold
        align: "center",
        verticalAlign: "middle",
      });
      btnGroup.add(btnText);

      btnGroup.offsetX(btn.width / 2);
      btnGroup.offsetY(btn.height / 2);

      btnGroup.on("click", () => this.onButtonClick(btn.id));
      return btnGroup;
    };

    // Create buttons helper
    const btnWidth = 180;
    const btnHeight = 50;
    const leaderboardButton = createButton({
      id: "leaderboard",
      label: "Leaderboard",
      x: STAGE_WIDTH - 50,
      y: 55,
      width: 70,
      height: 70,
    });
    const battleButton = createButton({
      id: "battle",
      label: "Battle",
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 70,
      width: btnWidth,
      height: btnHeight,
      fill: "#004a3a", // dark green
    });
    const cardsButton = createButton({
      id: "cards",
      label: "Cards Library",
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 70,
      width: btnWidth,
      height: btnHeight,
      fill: "#000080", // dark blue
    });
    const logoutButton = createButton({
      id: "logout",
      label: "Log Out",
      x: STAGE_WIDTH - 70,
      y: STAGE_HEIGHT - 40,
      width: 100,
      height: 40,
      fill: "#460000", // dark red
    });
    this.group.add(leaderboardButton, battleButton, cardsButton, logoutButton);

    this.model.subscribe(() => this.updatePoints());
    this.updatePoints();
  }

  /**
   * Update points display
   */
  updatePoints() {
    this.pointsText.text(`Points: ${this.model.getTotalPoints()}`);
    this.pointsText.offsetX(this.pointsText.width() / 2);
    this.pointsText.offsetY(this.pointsText.height() / 2);
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
