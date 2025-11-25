/**
 * ResultsScreenModel
 * 逻辑核心：
 * 1. 接收双方皇冠数
 * 2. 判断输赢 (player > enemy)
 * 3. 计算得分 (基于胜负和皇冠数的公式)
 */
export class ResultsScreenModel {
  private playerCrowns: number;
  private enemyCrowns: number;
  
  // 计算出的结果
  private won: boolean = false;
  private pointsEarned: number = 0;

  constructor(playerCrowns: number, enemyCrowns: number) {
    this.playerCrowns = playerCrowns;
    this.enemyCrowns = enemyCrowns;
    
    // 初始化时立即进行计算
    this.calculateOutcome();
  }

  private calculateOutcome(): void {
    // 1. 判断输赢
    // 规则：只要玩家皇冠数多于敌人，就算赢。平局算输（或者你可以自定义平局逻辑）
    if (this.playerCrowns > this.enemyCrowns) {
      this.won = true;
    } else {
      this.won = false;
    }

    // 2. 计算得分 (Points Calculation Formula)
    // 你可以根据游戏平衡性随意调整这些数值
    const WIN_BONUS = 300;       // 胜利基础分
    const CROWN_BONUS = 100;     // 每个皇冠奖励分
    const LOSS_CROWN_BONUS = 50; // 失败时每个皇冠的安慰分

    if (this.won) {
      // 胜利得分 = 胜利奖励 + 皇冠奖励
      this.pointsEarned = WIN_BONUS + (this.playerCrowns * CROWN_BONUS);
    } else {
      // 失败得分 = 仅计算皇冠安慰分 (防止分数为负)
      this.pointsEarned = this.playerCrowns * LOSS_CROWN_BONUS;
    }
  }

  /**
   * 返回 View 所需的数据结构
   * View 需要: { won, castlesDestroyed, pointsEarned }
   */
  getViewData() {
    return {
      won: this.won,
      castlesDestroyed: this.playerCrowns, // 玩家摧毁的堡垒数 = 玩家皇冠数
      pointsEarned: this.pointsEarned,
    };
  }
}