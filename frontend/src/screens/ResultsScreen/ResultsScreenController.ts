import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { ResultsScreenView } from "./ResultsScreenView.ts";
import { PlayerModel } from "../../PlayerModel.ts"; 
import { ResultsScreenModel } from "./ResultsScreenModel.ts"; 

/**
 * ResultsScreenController
 * 协调者：接收皇冠数据 -> 调用 Model 计算 -> 更新 View -> 同步后端
 */
export class ResultsScreenController extends ScreenController {
  private view: ResultsScreenView;
  private screenSwitcher: ScreenSwitcher;
  private playerModel: PlayerModel;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.playerModel = PlayerModel.getInstance();
    
    // View 的初始化保持不变，因为它只负责回调
    this.view = new ResultsScreenView(
      () => this.handleMenuClick(),
      () => this.handlePlayAgainClick(),
      () => this.handleLeaderboardClick(),
    );
  }

  private handleMenuClick(): void {
    this.screenSwitcher.switchToScreen({ type: "menu" });
  }

  private handlePlayAgainClick(): void {
    // 根据你的逻辑，可能回到菜单或选卡界面
    this.screenSwitcher.switchToScreen({ type: "menu" }); 
  }

  private handleLeaderboardClick(): void {
    this.screenSwitcher.switchToScreen({ type: "leaderboard" });
  }

  /**
   * 新的接口：接收双方皇冠数
   */
  async showResults(playerCrowns: number, enemyCrowns: number): Promise<void> {
    console.log(`Battle Ended. Player: ${playerCrowns}, Enemy: ${enemyCrowns}`);

    // 1. 初始化 Model (Model 内部会计算输赢和分数)
    const resultModel = new ResultsScreenModel(playerCrowns, enemyCrowns);
    
    // 2. 获取 View 所需的数据 { won, castlesDestroyed, pointsEarned }
    const viewData = resultModel.getViewData();

    // 3. 立即更新 UI (Optimistic UI)
    this.view.updateResults(viewData);
    this.show();
    this.view.getGroup().getLayer()?.batchDraw();

    // 4. 后台同步分数
    if (viewData.pointsEarned > 0) {
      try {
        await this.playerModel.updatePointsAsync(viewData.pointsEarned);
      } catch (error) {
        console.error("Failed to sync points to backend:", error);
      }
    }
  }

  getView(): ResultsScreenView {
    return this.view;
  }
}