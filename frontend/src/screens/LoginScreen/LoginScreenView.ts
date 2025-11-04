import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * LoginScreenView - Renders the login screen
 */
export class LoginScreenView implements View {
  private group: Konva.Group;
  private loginGroup: Konva.Group;
  private usernameRect: Konva.Rect;
  private passwordRect: Konva.Rect;
  private usernameInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private errorText: Konva.Text | null = null;

  constructor(private onButtonClick: (id: string) => void) {
    //SHOULD BE SET TO TRUE; ONLY FALSE FOR TESTING
    this.group = new Konva.Group({ visible: false });

    // Background Image
    const backgroundImage = new Image();
    backgroundImage.src = "/login_images/login_background.png";
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

    // Game title
    const gameTitle = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 30,
      text: "Math Royale",
      fontSize: 60,
      fontFamily: "Arial",
      fill: "#004d4d", // dark teal
      stroke: "#004d4d", // dark teal
      strokeWidth: 2,
      align: "center",
    });
    this.group.add(gameTitle);
    gameTitle.offsetX(gameTitle.width() / 2);

    // Login container group
    this.loginGroup = new Konva.Group({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
    });

    const containerWidth = STAGE_WIDTH / 2;
    const containerHeight = STAGE_HEIGHT / 2;

    // Container rectangle
    const container = new Konva.Rect({
      x: -containerWidth / 2,
      y: -containerHeight / 2,
      width: containerWidth,
      height: containerHeight,
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
      strokeWidth: 5,
      cornerRadius: 10,
      fill: "rgba(255, 255, 255, 0.6)",
    });
    this.loginGroup.add(container);

    // Login title
    const loginTitle = new Konva.Text({
      x: 0,
      y: -containerHeight / 2 + 30,
      text: "Login",
      fontSize: 30,
      fontFamily: "Arial",
      fill: "#004d4d", // dark teal
      stroke: "#004d4d", // dark teal
      strokeWidth: 2,
      align: "center",
    });
    this.loginGroup.add(loginTitle);
    loginTitle.offsetX(loginTitle.width() / 2);

    const inpPadding = 20;
    const inpWidth = containerWidth - inpPadding * 2;
    const inpHeight = 50;

    // Username box
    this.usernameRect = new Konva.Rect({
      x: 0,
      y: -containerHeight / 2 + 150,
      width: inpWidth,
      height: inpHeight,
      strokeLinearGradientStartPoint: { x: 0, y: 0 },
      strokeLinearGradientEndPoint: { x: 200, y: 300 },
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
    });
    this.loginGroup.add(this.usernameRect);
    this.usernameRect.offsetX(this.usernameRect.width() / 2);
    this.usernameRect.offsetY(this.usernameRect.height() / 2);
    this.usernameRect.on("click", () => this.onInputClick("username"));

    // Password box
    this.passwordRect = new Konva.Rect({
      x: 0,
      y: -containerHeight / 2 + 240,
      width: inpWidth,
      height: inpHeight,
      strokeLinearGradientStartPoint: { x: 0, y: 0 },
      strokeLinearGradientEndPoint: { x: 200, y: 300 },
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
    });
    this.loginGroup.add(this.passwordRect);
    this.passwordRect.offsetX(this.passwordRect.width() / 2);
    this.passwordRect.offsetY(this.passwordRect.height() / 2);
    this.passwordRect.on("click", () => this.onInputClick("password"));

    const btnWidth = 120;
    const btnHeight = 40;
    const btnSpacing = 10;

    // Create buttons helper
    const createButton = (btn: {
      id: string;
      label: string;
      x: number;
      y: number;
      fill: string;
    }): Konva.Group => {
      const btnGroup = new Konva.Group({ x: btn.x, y: btn.y });

      const btnRect = new Konva.Rect({
        width: btnWidth,
        height: btnHeight,
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
        fontSize: 18,
        fontFamily: "Arial",
        width: btnWidth,
        height: btnHeight,
        fill: "#bfa24a", // gold
        align: "center",
        verticalAlign: "middle",
      });
      btnGroup.add(btnText);

      btnGroup.offsetX(btnWidth / 2);
      btnGroup.offsetY(btnHeight / 2);

      btnGroup.on("click", () => this.onButtonClick(btn.id));

      return btnGroup;
    };

    // Create buttons
    const signUpButton = createButton({
      id: "signUp",
      label: "Sign Up",
      x: -btnWidth / 2 - btnSpacing,
      y: btnHeight / 2 + 80,
      fill: "#000080",
    });
    const loginButton = createButton({
      id: "login",
      label: "Login",
      x: btnWidth / 2 + btnSpacing,
      y: btnHeight / 2 + 80,
      fill: "#004a3a",
    });

    this.loginGroup.add(signUpButton);
    this.loginGroup.add(loginButton);

    this.group.add(this.loginGroup);
    this.createHtmlInputs();
  }

  private createHtmlInputs() {
    // Username input
    this.usernameInput = document.createElement("input");
    this.usernameInput.type = "text";
    this.usernameInput.placeholder = "Username";

    const usernamePos = this.usernameRect.getClientRect();
    Object.assign(this.usernameInput.style, {
      position: "absolute",
      left: `${usernamePos.x}px`,
      top: `${usernamePos.y}px`,
      width: `${usernamePos.width}px`,
      height: `${usernamePos.height}px`,
      fontSize: "18px",
      padding: "0 10px",
      border: "none",
      backgroundColor: "transparent",
      outline: "none",
    });
    document.body.appendChild(this.usernameInput);

    // Password input
    this.passwordInput = document.createElement("input");
    this.passwordInput.type = "password";
    this.passwordInput.placeholder = "Password";

    const passwordPos = this.passwordRect.getClientRect();
    Object.assign(this.passwordInput.style, {
      position: "absolute",
      left: `${passwordPos.x}px`,
      top: `${passwordPos.y}px`,
      width: `${passwordPos.width}px`,
      height: `${passwordPos.height}px`,
      fontSize: "18px",
      padding: "0 10px",
      border: "none",
      backgroundColor: "transparent",
      outline: "none",
    });
    document.body.appendChild(this.passwordInput);
  }

  // Get username & password values
  getInputValues(): { username: string; password: string } {
    return {
      username: this.usernameInput.value,
      password: this.passwordInput.value,
    };
  }

  // Show error message when necessary
  showErrorMessage(message: string): void {
    // If errorText doesn’t exist yet, create it
    if (!this.errorText) {
      this.errorText = new Konva.Text({
        x: 0,
        y: 0,
        text: message,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "red",
        align: "center",
      });

      this.errorText.y(this.loginGroup.height() / 2 + 200);
      this.errorText.offsetX(this.errorText.width() / 2);
      this.loginGroup.add(this.errorText);
    } else {
      this.errorText.text(message);
    }

    this.errorText.visible(true);
    this.errorText.getLayer()?.batchDraw();
  }

  // Hide error message
  hideErrorMessage(): void {
    if (this.errorText) {
      this.errorText.visible(false);
      this.errorText.getLayer()?.batchDraw();
    }
  }

  /**
   * Show the screen
   */
  show(): void {
    this.group.visible(true);
    this.usernameInput.value = "";
    this.passwordInput.value = "";
    this.usernameInput.style.display = "block";
    this.passwordInput.style.display = "block";
    this.group.getLayer()?.draw();
  }

  /**
   * Hide the screen
   */
  hide(): void {
    this.group.visible(false);
    this.usernameInput.style.display = "none";
    this.passwordInput.style.display = "none";
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
