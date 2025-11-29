import { API_BASE_URL } from "./constants.ts";

export interface PlayerData {
  token?: string;
  id: string;
  username: string;
  points: number;
  careerWins: number;
  careerLosses: number;
}

type Subscriber = () => void;

export class PlayerModel {
  private static instance: PlayerModel | null = null;
  private data: PlayerData | null = null;
  private subscribers: Subscriber[] = [];

  private constructor() {}

  static getInstance(): PlayerModel {
    if (!PlayerModel.instance) {
      PlayerModel.instance = new PlayerModel();
    }
    return PlayerModel.instance;
  }

  setPlayerData(data: PlayerData): void {
    this.data = { ...data };
    this.notify();
  }

  clear(): void {
    this.data = null;
    this.notify();
  }

  /**
   * Update points locally (without API call)
   */
  updatePoints(points: number): void {
    if (!this.data) {
      return;
    }
    this.data.points = points;
    this.notify();
  }

  /**
   * Add or subtract points from the user's total (with API sync)
   * @param pointsChange - Points to add (positive) or subtract (negative)
   * @returns Promise<number> - New points total
   */
  async updatePointsAsync(pointsChange: number): Promise<number> {
    if (!this.data) {
      throw new Error("User not logged in");
    }
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/user/points/update`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
        // [修改] 发送 username 而不是 userId
        body: JSON.stringify({
          username: this.data.username,
          pointsChange: pointsChange,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update points");
      }

      const result = await response.json();
      this.data.points = result.points;
      this.notify();
      return result.points;
    } catch (error) {
      console.error("Failed to update points:", error);
      throw error;
    }
  }

  /**
   * Set points to a specific value (with API sync)
   * @param points - New points value
   * @returns Promise<number> - New points total
   */
  async setPointsAsync(points: number): Promise<number> {
    const token = localStorage.getItem('jwt');
    if (!this.data || !token) {
      throw new Error("User not logged in");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/points`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
        // [修改] 发送 username 而不是 userId
        body: JSON.stringify({
          username: this.data.username,
          points: points,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set points");
      }

      const result = await response.json();
      this.data.points = result.points;
      this.notify();
      return result.points;
    } catch (error) {
      console.error("Failed to set points:", error);
      throw error;
    }
  }

  /**
   * Refresh points from server
   * @returns Promise<number> - Current points from server
   */
  async refreshPoints(): Promise<number> {
    const token = localStorage.getItem('jwt');
    if (!this.data || !token) {
      throw new Error("User not logged in");
    }

    try {
      // [修改] URL 使用 username
      const response = await fetch(`${API_BASE_URL}/user/points/${this.data.username}`, {
        headers: {
          "Authorization": `Bearer ${token!}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to refresh points");
      }

      const result = await response.json();
      this.data.points = result.points;
      this.notify();
      return result.points;
    } catch (error) {
      console.error("Failed to refresh points:", error);
      throw error;
    }
  }

  getTotalPoints(): number {
    return this.data?.points ?? 0;
  }

  getUsername(): string {
    return this.data?.username ?? "";
  }

  getId(): string {
    return this.data?.id ?? "";
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach((cb) => cb());
  }
}