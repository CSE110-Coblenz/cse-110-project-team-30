import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

interface ButtonConfig {
	id: string; 
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
	textColor: string;
}

/**
 * MenuScreenView - Renders the menu screen
 */
export class MenuScreenView implements View {
        private group: Konva.Group;
	private pointsText: Konva.Text;

        constructor(buttons: ButtonConfig[]) {
		this.group = new Konva.Group({ visible: true });
		
                // Title text
                const title = new Konva.Text({
                        x: STAGE_WIDTH / 2,
                        y: 50,
                        text: "Welcome!",
                        fontSize: 48,
                        fontFamily: "Arial",
                        fill: "black",
                        stroke: "blue", 
                        strokeWidth: 2,
                        align: "center",
                });
                title.offsetX(title.width() / 2);
                this.group.add(title);
                
		// Display points
		const pointsGroup = new Konva.Group({ x: 20, y: 20 });
		const pointsImage = new Konva.Image({
            		x: 0,
            		y: 0,
            		width: 50,
            		height: 50,
            		offsetX: 25,
           		offsetY: 25,
        	});
        	const pointsImgObj = new Image();
        	pointsImgObj.src = "/menu_images/points.png";
        	pointsImgObj.onload = () => {
            		pointsImage.image(pointsImgObj);
            		this.group.getLayer()?.draw();
        	};
        	pointsGroup.add(pointsImage);
	
        	this.pointsText = new Konva.Text({
            		text: "0",
            		fontSize: 24,
            		fontFamily: "Arial",
            		fill: "yellow",
            		stroke: "black",
            		strokeWidth: 1,
            		align: "left",
        	});
            	this.pointsText.x(pointsImage.width() + 5);
            	this.pointsText.y(pointsImage.height() / 2 - this.pointsText.fontSize() / 2);
        	
		pointsGroup.add(this.pointsText);
                this.group.add(pointsGroup);

		buttons.forEach(btn => {
			const buttonGroup = new Konva.Group(); 
			const padding = 5;	

			if (btn.id === "leaderboard") {
                		const leaderboardText = new Konva.Text({
                        		text: btn.label,
                        		fontSize: 16,
                        		fontFamily: "Arial",
					x: btn.x - btn.width / 2,
                			y: btn.y + btn.height / 2 + padding,
                        		fill: btn.textColor,
                		});

				const leaderboardImage = new Konva.Image({
                    			width: btn.width,
                    			height: btn.height,
                    			offsetX: btn.width / 2,
                    			offsetY: btn.height / 2,
                    			x: btn.x,
                    			y: btn.y,
                		});
                		const lbImgObj = new Image();
                		lbImgObj.src = "/menu_images/leaderboard.png";
                		lbImgObj.onload = () => {
                    			leaderboardImg.image(lbImgObj);
                    			this.group.getLayer()?.draw();
                		};
                		buttonGroup.add(leaderboardImage);
                		buttonGroup.add(leaderboardText);
			} else {
                		const text = new Konva.Text({
                        		text: btn.label,
                        		fontSize: 24,
                        		fontFamily: "Arial",
                        		fill: btn.textColor,
                        		align: "center",
                		});

				const btnWidth = text.width() + padding * 2;
				const btnHeight = text.height() + padding * 2;
				const rect = new Konva.Rect({
                        		x: btn.x - btnWidth / 2,
                        		y: btn.y - btnHeight / 2,
                        		width: btnWidth,
                        		height: btnHeight,
                        		stroke: "black",
                        		strokeWidth: 3,
					cornerRadius: 10,
					fillLinearGradientStartPointY: 0,
    					fillLinearGradientEndPointY: btnHeight,
    					fillLinearGradientColorStops: [0, "#ffffff", 1, btn.fill],
    					shadowColor: "rgba(0, 0, 0, 0.5)",
    					shadowBlur: 10,
    					shadowOffsetX: 4,
    					shadowOffsetY: 4,
    					shadowOpacity: 0.6,
                		});
				text.x(btn.x - text.width() / 2);
                		text.y(btn.y - text.height() / 2);
                
                		buttonGroup.add(rect);
                		buttonGroup.add(text);
			}

                	buttonGroup.on("click", () => this.handleClick(btn.id));
                	this.group.add(buttonGroup);
		});
	}

        /**
         * Update points display
         */
	updatePoints(points: number) {
		this.pointsText.text(`${points}`);
                this.group.getLayer()?.draw();
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
