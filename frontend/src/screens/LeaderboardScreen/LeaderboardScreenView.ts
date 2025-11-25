import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { API_BASE_URL } from "../../constants.ts";

interface LeaderboardEntry {
  username: string;
  points: number;
}

/**
 * LeaderboardScreenView - Renders the leaderboard screen
 */
export class LeaderboardScreenView implements View {
  private group: Konva.Group;
  private entries: LeaderboardEntry[] = [];
  private entryTexts: Konva.Text[] = [];
  private onBackClick: () => void;

  constructor(onBackClick: () => void) {
    this.onBackClick = onBackClick;
    this.group = new Konva.Group({ visible: false });
    this.createUI();
    this.loadLeaderboard();
  }

  private createUI(): void {
    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#2d2d44",
    });
    this.group.add(background);

    // Title
    const title = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 50,
      text: "Leaderboard",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "#ffffff",
      align: "center",
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // Back button
    const backButton = new Konva.Group({
      x: 30,
      y: 30,
      cursor: "pointer",
    });

    const buttonRect = new Konva.Rect({
      width: 100,
      height: 40,
      fill: "#4a90e2",
      cornerRadius: 10,
      shadowColor: "black",
      shadowBlur: 5,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.2,
    });

    const buttonText = new Konva.Text({
      text: "Back",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "white",
      width: 100,
      height: 40,
      align: "center",
      verticalAlign: "middle",
    });

    backButton.add(buttonRect);
    backButton.add(buttonText);

    backButton.on("click", () => this.onBackClick());
    backButton.on("mouseover", () => {
      buttonRect.fill("#3a7bd5");
      backButton.getLayer()?.draw();
    });
    backButton.on("mouseout", () => {
      buttonRect.fill("#4a90e2");
      backButton.getLayer()?.draw();
    });

    this.group.add(backButton);
  }

  private async loadLeaderboard(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LeaderboardEntry[] = await response.json();
      // Ensure data is an array and has valid format
      this.entries = Array.isArray(data) ? data : [];
      this.renderLeaderboard();
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      // Show error message
      const errorText = new Konva.Text({
        x: STAGE_WIDTH / 2,
        y: STAGE_HEIGHT / 2,
        text: "Failed to load leaderboard",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "#ff6b6b",
        align: "center",
      });
      errorText.offsetX(errorText.width() / 2);
      this.group.add(errorText);
      this.group.getLayer()?.draw();
    }
  }

  private renderLeaderboard(): void {
    // Clear existing entries
    this.entryTexts.forEach((text) => text.destroy());
    this.entryTexts = [];

    const startY = 150;
    const rowHeight = 40;
    const maxEntries = 20; // Show top 20

    // Header
    const headerY = startY - 30;
    const rankHeader = new Konva.Text({
      x: 100,
      y: headerY,
      text: "Rank",
      fontSize: 20,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#ffffff",
    });
    this.group.add(rankHeader);

    const nameHeader = new Konva.Text({
      x: 200,
      y: headerY,
      text: "Username",
      fontSize: 20,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#ffffff",
    });
    this.group.add(nameHeader);

    const pointsHeader = new Konva.Text({
      x: STAGE_WIDTH - 150,
      y: headerY,
      text: "Points",
      fontSize: 20,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#ffffff",
      align: "right",
    });
    pointsHeader.offsetX(pointsHeader.width());
    this.group.add(pointsHeader);

    // Render entries
    const entriesToShow = this.entries.slice(0, maxEntries);
    entriesToShow.forEach((entry, index) => {
      const y = startY + index * rowHeight;

      // Rank color (top 3 get special colors)
      let rankColor = "#ffffff";
      let pointColor = "#cccccc";
      if (index === 0) {
        rankColor = "#ffd700"; // Gold
        pointColor = "#ffd700";
      } else if (index === 1) {
        rankColor = "#c0c0c0"; // Silver
        pointColor = "#c0c0c0";
      } else if (index === 2) {
        rankColor = "#cd7f32"; // Bronze
        pointColor = "#cd7f32";
      }

      // Rank
      const rankText = new Konva.Text({
        x: 100,
        y: y,
        text: `${index + 1}`,
        fontSize: 18,
        fontFamily: "Arial",
        fontStyle: index < 3 ? "bold" : "normal",
        fill: rankColor,
      });
      this.group.add(rankText);
      this.entryTexts.push(rankText);

      // Username
      const nameText = new Konva.Text({
        x: 200,
        y: y,
        text: entry.username || "Unknown",
        fontSize: 18,
        fontFamily: "Arial",
        fill: "#ffffff",
      });
      this.group.add(nameText);
      this.entryTexts.push(nameText);

      // Points
      const pointsText = new Konva.Text({
        x: STAGE_WIDTH - 150,
        y: y,
        text: (entry.points ?? 0).toString(),
        fontSize: 18,
        fontFamily: "Arial",
        fontStyle: index < 3 ? "bold" : "normal",
        fill: pointColor,
        align: "right",
      });
      pointsText.offsetX(pointsText.width());
      this.group.add(pointsText);
      this.entryTexts.push(pointsText);
    });

    this.group.getLayer()?.draw();
  }

  /**
   * Show the screen
   */
  show(): void {
    this.group.visible(true);
    // Reload leaderboard data when showing
    this.loadLeaderboard();
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
