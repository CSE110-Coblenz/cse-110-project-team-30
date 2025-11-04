export class PlayerModel {
  private totalPoints: number = 0;
  private subscribers: (() => void)[] = [];

  updateTotalPoints(points: number) {
    this.totalPoints += points;
    this.notify();
  }

  getTotalPoints() {
    return this.totalPoints;
  }

  // Allow screens to subscribe to changes
  subscribe(callback: (points: number) => void) {
    this.subscribers.push(callback);
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.totalPoints));
  }
}
