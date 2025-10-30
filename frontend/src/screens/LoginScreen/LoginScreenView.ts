import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * LoginScreenView - Renders the login screen
 */
export class LoginScreenView implements View {
	private group: Konva.Group;
	private usernameText: Konva.Text;
	private passwordText: Konva.Text;

	constructor() {
		this.group = new Konva.Group({ visible: true });
		
		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#cfe3fe",
		});
		this.group.add(background);

		const gameTitle = new Konva.Text({
                        x: STAGE_WIDTH / 2,
                        y: 30,
                        text: "Math Royale",
                        fontSize: 60,
                        fontFamily: "Arial",
                        fill: "black",
                        stroke: "blue", 
                        strokeWidth: 2,
                        align: "center",
                });
                this.group.add(gameTitle);
                gameTitle.offsetX(gameTitle.width() / 2);
	
		const loginGroup = new Konva.Group({ 
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
		});
		
		const containerWidth = STAGE_WIDTH / 2;
		const containerHeight = STAGE_HEIGHT / 2;
		
		// Container border
		const containerBorder = new Konva.Rect({
    			x: -containerWidth / 2,
    			y: -containerHeight / 2,
    			width: containerWidth,
    			height: containerHeight,
			stroke: "black",
			strokeWidth: 3,
			cornerRadius: 10,
			fill: "#ffffff",
		});
		loginGroup.add(containerBorder);

		const loginTitle = new Konva.Text({
                        x: 0,
                        y: -containerHeight / 2 + 30,
                        text: "Login",
                        fontSize: 30,
                        fontFamily: "Arial",
                        fill: "black",
                        stroke: "blue", 
                        strokeWidth: 2,
                        align: "center",
                });
                loginGroup.add(loginTitle);
                loginTitle.offsetX(loginTitle.width() / 2);
	
		const inpPadding = 20;
		const inpWidth = containerWidth - inpPadding * 2;
		const inpHeight = 50;
		
		const usernameInput = new Konva.Rect({
                        x: 0,
                        y: -containerHeight / 2 + 150,
                        width: inpWidth,
                        height: inpHeight,
                        stroke: "black",
                        strokeWidth: 3,
                });
                loginGroup.add(usernameInput);
		usernameInput.offsetX(usernameInput.width() / 2);
		usernameInput.offsetY(usernameInput.height() / 2);

		// Placeholder text for username
		this.usernameText = new Konva.Text({
			x: usernameInput.x() - usernameInput.width() / 2 + inpPadding * 3,
			y: usernameInput.y(),
			text: "Username",
			fontSize: 18,
			fontFamily: "Arial",
			fill: "black",
			opacity: 0.3,
		});
		loginGroup.add(this.usernameText);
		this.usernameText.offsetX(this.usernameText.width() / 2);
		this.usernameText.offsetY(this.usernameText.height() / 2);
		
		const passwordInput = new Konva.Rect({
                        x: 0,
                        y: -containerHeight / 2 + 250,
                        width: inpWidth,
                        height: inpHeight,
                        stroke: "black",
                        strokeWidth: 3,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                        shadowBlur: 10,
                        shadowOffsetX: 4,
                        shadowOffsetY: 4,
                        shadowOpacity: 0.6,
                });
                loginGroup.add(passwordInput);
		passwordInput.offsetX(passwordInput.width() / 2);
		passwordInput.offsetY(passwordInput.height() / 2);
		
		// Placeholder text for password
		this.passwordText = new Konva.Text({
			x: passwordInput.x() - passwordInput.width() / 2 + inpPadding * 3,
			y: passwordInput.y(),
			text: "Password",
			fontSize: 18,
			fontFamily: "Arial",
			fill: "black",
			opacity: 0.3,
		});
		loginGroup.add(this.passwordText);
		this.passwordText.offsetX(this.passwordText.width() / 2);
		this.passwordText.offsetY(this.passwordText.height() / 2);
		
		const btnWidth = 120;
		const btnHeight = 40;
		const btnSpacing = 10;
		
		const signUpButton = new Konva.Rect({
                        x: -btnWidth / 2 - btnSpacing,
                        y: btnHeight / 2 + 80,
                        width: btnWidth,
                        height: btnHeight,
                        stroke: "black",
                        strokeWidth: 3,
			cornerRadius: 10,
    			shadowColor: "rgba(0, 0, 0, 0.5)",
    			shadowBlur: 10,
    			shadowOffsetX: 4,
    			shadowOffsetY: 4,
    			shadowOpacity: 0.6,
		});
                loginGroup.add(signUpButton);
		signUpButton.offsetX(signUpButton.width() / 2);
		signUpButton.offsetY(signUpButton.height() / 2);
               	signUpButton.on("click", () => this.handleClick('signUp'));

		const signUpText = new Konva.Text({
                        x: signUpButton.x(),
                        y: signUpButton.y(),
                        text: "Sign Up",
                        fontSize: 18,
                        fontFamily: "Arial",
                        fill: "black",
                });
                loginGroup.add(signUpText);
		signUpText.offsetX(signUpText.width() / 2);
		signUpText.offsetY(signUpText.height() / 2);

		const loginButton = new Konva.Rect({
                        x: btnWidth / 2 + btnSpacing,
                        y: btnHeight / 2 + 80,
                        width: btnWidth,
                        height: btnHeight,
                        stroke: "black",
                        strokeWidth: 3,
                        cornerRadius: 10,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                        shadowBlur: 10,
                        shadowOffsetX: 4,
                        shadowOffsetY: 4,
                        shadowOpacity: 0.6,
                });
                loginGroup.add(loginButton);
		loginButton.offsetX(loginButton.width() / 2);
		loginButton.offsetY(loginButton.height() / 2);
               	loginButton.on("click", () => this.handleClick('login'));

		const loginText = new Konva.Text({
                        x: loginButton.x(),
                        y: loginButton.y(),
                        text: "Login",
                        fontSize: 18,
                        fontFamily: "Arial",
                        fill: "black",
                });
                loginGroup.add(loginText);
		loginText.offsetX(loginText.width() / 2);
		loginText.offsetY(loginText.height() / 2);

		this.group.add(loginGroup);
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
