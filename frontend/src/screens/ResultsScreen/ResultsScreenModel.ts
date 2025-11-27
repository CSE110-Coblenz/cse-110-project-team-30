/**
 * Represents a single leaderboard entry
 */
/*export type LeaderboardEntry = {
  score: number;
  timestamp: string; // formatted timestamp
};*/

/**
 * ResultsScreenModel - Stores final score and leaderboard
 */
export class ResultsScreenModel {
  private totalPoints: number;
  //private leaderboard: LeaderboardEntry[] = [];

  /**
   * Set total points
   */
  setTotalPoints(points: number): void {
    this.totalPoints += points;
    this.checkRank();
  }

  /**
   * Get the total points
   */
  getTotalPoints(): number {
    return this.totalPoints;
  }

  /**
   * Set the leaderboard entries
   */
  /*setLeaderboard(entries: LeaderboardEntry[]): void {
    this.leaderboard = entries;
  }*/
}
