import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LoginScreenView } from "./LoginScreenView.ts";
import { API_BASE_URL } from "../../constants.ts";
import { PlayerModel } from "../../PlayerModel.ts";

/**
 * LoginScreenController - Handles login interactions
 */
export class LoginScreenController extends ScreenController {
  private view: LoginScreenView;
  private screenSwitcher: ScreenSwitcher;
  private playerModel: PlayerModel;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.playerModel = PlayerModel.getInstance();
    this.view = new LoginScreenView((id: string) => this.handleButtonClick(id));
  }

  /**
   * Handle button click
   *    * 1. 变为 'async' 来使用 'await'
   * 2. 调用新的 handleApiCall 辅助函数
   */
  private async handleButtonClick(buttonId: string): Promise<void> {
    const { username, password } = this.view.getInputValues();

    // 验证逻辑保持不变
    if (!username.trim() || !password.trim()) {
      this.view.showErrorMessage("Please enter both username and password");
      return;
    }

    this.view.hideErrorMessage();

    // 根据按钮 ID 调用不同的 API 端点
    switch (buttonId) {
      case "signUp":
        await this.handleApiCall("signup", { username, password });
        break;
      case "login":
        await this.handleApiCall("login", { username, password });
        break;
    }
  }

  /**
   * 新的辅助函数，用于处理 fetch API 调用
   */
  private async handleApiCall(
    endpoint: "login" | "signup",
    credentials: { username: string; password: string }
  ): Promise<void> {
    try {
      // 1. 发送请求到你的后端
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      localStorage.setItem('jwt', data.token);
      if (response.ok) {
        if (endpoint === "login") {
          this.playerModel.setPlayerData({
            id: data.id,
            username: data.username,
            points: data.points ?? 0,
            careerWins: data.careerWins ?? 0,
            careerLosses: data.careerLosses ?? 0,
          });
        } else {
          this.playerModel.setPlayerData({
            id: data.id,
            username: data.username,
            points: 0,
            careerWins: 0,
            careerLosses: 0,
          });
        }
        
        // 切换到主菜单
        this.screenSwitcher.switchToScreen({ type: "menu" });
      } else {
        // 3. 登录/注册失败！
        // 从后端显示错误信息 (例如 "Invalid credentials" 或 "Username already exists")
        this.view.showErrorMessage(data.error || "An unknown error occurred.");
      }
    } catch (error) {
      // 4. 网络错误 (例如服务器未运行)
      console.error(`Failed to ${endpoint}:`, error);
      this.view.showErrorMessage("Cannot connect to server. Please try again.");
    }
  }

  /**
   * Get the view
   */
  getView(): LoginScreenView {
    return this.view;
  }
}
