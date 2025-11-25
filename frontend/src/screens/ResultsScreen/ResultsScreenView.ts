import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * ResultsScreenView - Renders the results screen
 * 
 * Displays:
 * - Win/Loss status
 * - Castles destroyed
 * - Points earned
 * - Navigation buttons
 */
export class ResultsScreenView implements View {
  private group: Konva.Group;
  private outcomeText!: Konva.Text;
  private castlesText!: Konva.Text;
  private pointsText!: Konva.Text;
  private onMenuClick?: () => void;
  private onPlayAgainClick?: () => void;
  private onLeaderboardClick?: () => void;

  constructor(
    onMenuClick?: () => void,
    onPlayAgainClick?: () => void,
    onLeaderboardClick?: () => void,
  ) {
    this.onMenuClick = onMenuClick;
    this.onPlayAgainClick = onPlayAgainClick;
    this.onLeaderboardClick = onLeaderboardClick;
    this.group = new Konva.Group({ visible: false });
    this.createLayout();
  }

  /**
   * Build the UI layout
   */
  private createLayout(): void {
    // Background with gradient
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: STAGE_HEIGHT },
      fillLinearGradientColorStops: [
        0, "#1a1a2e",
        0.5, "#16213e",
        1, "#0f3460"
      ],
    });
    this.group.add(background);

    // Main content panel
    const panelWidth = Math.min(STAGE_WIDTH * 0.75, 800);
    const panelHeight = Math.min(STAGE_HEIGHT * 0.7, 600);
    const panel = new Konva.Rect({
      x: STAGE_WIDTH / 2 - panelWidth / 2,
      y: STAGE_HEIGHT / 2 - panelHeight / 2,
      width: panelWidth,
      height: panelHeight,
      fill: "rgba(15, 23, 42, 0.95)",
      stroke: "#3b82f6",
      strokeWidth: 3,
      cornerRadius: 25,
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowBlur: 30,
      shadowOffset: { x: 0, y: 15 },
      shadowOpacity: 0.8,
    });
    this.group.add(panel);

    // Decorative top border
    const topBorder = new Konva.Rect({
      x: panel.x(),
      y: panel.y(),
      width: panelWidth,
      height: 6,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: panelWidth, y: 0 },
      fillLinearGradientColorStops: [
        0, "#3b82f6",
        0.5, "#8b5cf6",
        1, "#3b82f6"
      ],
      cornerRadius: [25, 25, 0, 0],
    });
    this.group.add(topBorder);

    // Outcome text (Victory/Defeat)
    this.outcomeText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: panel.y() + 80,
      text: "Victory!",
      fontSize: 64,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#10b981",
      shadowColor: "rgba(16, 185, 129, 0.5)",
      shadowBlur: 20,
      shadowOffset: { x: 0, y: 0 },
    });
    this.outcomeText.offsetX(this.outcomeText.width() / 2);
    this.group.add(this.outcomeText);

    // Stats container
    const statsY = this.outcomeText.y() + 120;
    const statSpacing = 100;

    // Castles destroyed
    const castlesIcon = new Konva.Text({
      x: STAGE_WIDTH / 2 - 150,
      y: statsY,
      text: "🏰",
      fontSize: 48,
    });
    castlesIcon.offsetX(castlesIcon.width() / 2);
    this.group.add(castlesIcon);

    this.castlesText = new Konva.Text({
      x: STAGE_WIDTH / 2 - 150,
      y: statsY + 60,
      text: "0 Castles",
      fontSize: 24,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#fbbf24",
      align: "center",
      width: 200,
    });
    this.castlesText.offsetX(this.castlesText.width() / 2);
    this.group.add(this.castlesText);

    const castlesLabel = new Konva.Text({
      x: STAGE_WIDTH / 2 - 150,
      y: statsY + 90,
      text: "Destroyed",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "#94a3b8",
      align: "center",
      width: 200,
    });
    castlesLabel.offsetX(castlesLabel.width() / 2);
    this.group.add(castlesLabel);

    // Points earned
    const pointsIcon = new Konva.Text({
      x: STAGE_WIDTH / 2 + 150,
      y: statsY,
      text: "⭐",
      fontSize: 48,
    });
    pointsIcon.offsetX(pointsIcon.width() / 2);
    this.group.add(pointsIcon);

    this.pointsText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 150,
      y: statsY + 60,
      text: "+0 Points",
      fontSize: 24,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#fbbf24",
      align: "center",
      width: 200,
    });
    this.pointsText.offsetX(this.pointsText.width() / 2);
    this.group.add(this.pointsText);

    const pointsLabel = new Konva.Text({
      x: STAGE_WIDTH / 2 + 150,
      y: statsY + 90,
      text: "Earned",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "#94a3b8",
      align: "center",
      width: 200,
    });
    pointsLabel.offsetX(pointsLabel.width() / 2);
    this.group.add(pointsLabel);

    // Divider line
    const divider = new Konva.Line({
      points: [
        panel.x() + panelWidth * 0.15,
        panel.y() + panelHeight * 0.6,
        panel.x() + panelWidth * 0.85,
        panel.y() + panelHeight * 0.6,
      ],
      stroke: "#475569",
      strokeWidth: 2,
      dash: [10, 5],
    });
    this.group.add(divider);

    // Buttons
    this.createButtons(panel);
  }

  /**
   * Create navigation buttons
   */
  private createButtons(panel: Konva.Rect): void {
    const buttonY = panel.y() + panel.height() - 100;
    const buttonWidth = 180;
    const buttonHeight = 55;
    const buttonSpacing = 40; // Increased spacing between buttons

    // Calculate total width of all buttons with spacing
    const totalWidth = 3 * buttonWidth + 2 * buttonSpacing;
    const startX = STAGE_WIDTH / 2 - totalWidth / 2;

    const buttons = [
      {
        label: "Menu",
        x: startX,
        fill: "#3b82f6",
        hoverFill: "#2563eb",
        onClick: this.onMenuClick,
      },
      {
        label: "Play Again",
        x: startX + buttonWidth + buttonSpacing,
        fill: "#10b981",
        hoverFill: "#059669",
        onClick: this.onPlayAgainClick,
      },
      {
        label: "Leaderboard",
        x: startX + 2 * (buttonWidth + buttonSpacing),
        fill: "#8b5cf6",
        hoverFill: "#7c3aed",
        onClick: this.onLeaderboardClick,
      },
    ];

    buttons.forEach((btn) => {
      const group = new Konva.Group({
        x: btn.x,
        y: buttonY,
        cursor: "pointer",
      });

      const rect = new Konva.Rect({
        width: buttonWidth,
        height: buttonHeight,
        fill: btn.fill,
        cornerRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 5 },
        shadowOpacity: 0.6,
      });

      const text = new Konva.Text({
        text: btn.label,
        fontSize: 20,
        fontFamily: "Arial",
        fontStyle: "bold",
        fill: "#ffffff",
        width: buttonWidth,
        height: buttonHeight,
        align: "center",
        verticalAlign: "middle",
      });

      group.add(rect);
      group.add(text);

      // Hover effects
      group.on("mouseenter", () => {
        rect.fill(btn.hoverFill);
        rect.scale({ x: 1.05, y: 1.05 });
        group.getLayer()?.draw();
      });

      group.on("mouseleave", () => {
        rect.fill(btn.fill);
        rect.scale({ x: 1, y: 1 });
        group.getLayer()?.draw();
      });

      group.on("click", () => {
        btn.onClick?.();
      });

      this.group.add(group);
    });
  }

  /**
   * Update the results display
   */
  updateResults(data: {
    won: boolean;
    castlesDestroyed: number;
    pointsEarned: number;
  }): void {
    // Update outcome
    if (data.won) {
      this.outcomeText.text("Victory!");
      this.outcomeText.fill("#10b981");
    } else {
      this.outcomeText.text("Defeat");
      this.outcomeText.fill("#ef4444");
    }
    this.outcomeText.offsetX(this.outcomeText.width() / 2);

    // Update castles
    this.castlesText.text(`${data.castlesDestroyed} Castle${data.castlesDestroyed !== 1 ? "s" : ""}`);
    this.castlesText.offsetX(this.castlesText.width() / 2);

    // Update points
    const pointsSign = data.pointsEarned >= 0 ? "+" : "";
    this.pointsText.text(`${pointsSign}${data.pointsEarned} Points`);
    this.pointsText.fill(data.pointsEarned >= 0 ? "#10b981" : "#ef4444");
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
