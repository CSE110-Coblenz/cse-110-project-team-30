/**
 * ResultsScreenModel - Stores final score
 */
export class ResultsScreenModel {
  private totalPoints: number;

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
}
