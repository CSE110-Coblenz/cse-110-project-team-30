import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH } from "../../constants.ts";

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
                        y: 150,
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
        	this.pointsText = new Konva.Text({
            		x: 20,
            		y: 20,
            		text: "0",
            		fontSize: 24,
            		fontFamily: "Arial",
            		fill: "yellow",
            		stroke: "black",
            		strokeWidth: 1,
            		align: "left",
        	});
        	this.group.add(this.pointsText);

                // Points image
		Konva.Image.fromURL("/points.png", (image) => {
                        image.width(80);
                        image.height(80);
                        image.offsetX(image.width() / 2);
                        image.offsetY(image.height() / 2);
                        image.x(STAGE_WIDTH / 2);
                        image.y(STAGE_HEIGHT / 2);
                        this.group.add(this.image);
                        this.group.getLayer()?.draw();
		});

		buttons.forEach(btn => {
			const buttonGroup = new Konva.Group();
                
                	const text = new Konva.Text({
                        	text: btn.label,
                        	fontSize: 24,
                        	fontFamily: "Arial",
                        	fill: btn.textColor,
                        	align: "center",
                	});

			const textWidth = text.width();
			const textHeight = text.height();
			const padding = 5;
			
			let shape: Konva.Shape | Konva.Image;

			if (btn.id === "leaderboard") {
				const imgShape = new Konva.Image({
        				x: btn.x,
        				y: btn.y,
       					width: btn.width,
        				height: btn.height,
        				offsetX: btn.width / 2,
        				offsetY: btn.height / 2
    				});

    					const imageObj = new Image();
    					imageObj.src = "/leaderboard.png";
    					imageObj.onload = () => {
        				imgShape.image(imageObj);
        				this.group.getLayer()?.draw();
    				};
    				shape = imgShape;
			} else {
				const btnWidth = textWidth + padding * 2;
				const btnHeight = textHeight + padding * 2;
				shape = new Konva.Rect({
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
			}
			text.x(btn.x - textWidth / 2);
                	text.y(btn.y - textHeight / 2);
                
                	buttonGroup.add(shape);
                	buttonGroup.add(text);
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
