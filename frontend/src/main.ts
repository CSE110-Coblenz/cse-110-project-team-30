import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { LoginScreenController } from "./screens/LoginScreen/LoginScreenController.ts";
import { MenuScreenController } from "./screens/MenuScreen/MenuScreenController.ts";
import { CardsScreenController } from "./screens/CardsScreen/CardsScreenController.ts";
import { BattleScreenController } from "./screens/BattleScreen/BattleScreenController.ts";
import { ResultsScreenController } from "./screens/ResultsScreen/ResultsScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */
class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private loginController: LoginScreenController;
  private menuController: MenuScreenController;
  private cardsController: CardsScreenController;
  private battleController: BattleScreenController;
  private resultsController: ResultsScreenController;

  constructor(container: string) {
    // Initialize Konva stage (the main canvas)
    this.stage = new Konva.Stage({
      container,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
    });

    // Create a layer (screens will be added to this layer)
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Initialize all screen controllers
    // Each controller manages a Model, View, and handles user interactions
    this.loginController = new LoginScreenController(this);
    this.menuController = new MenuScreenController(this);
    this.cardsController = new CardsScreenController(this);
    this.battleController = new BattleScreenController(this);
    this.resultsController = new ResultsScreenController(this);

    // Add all screen groups to the layer
    // All screens exist simultaneously but only one is visible at a time
    this.layer.add(this.loginController.getView().getGroup());
    this.layer.add(this.menuController.getView().getGroup());
    this.layer.add(this.cardsController.getView().getGroup());
    this.layer.add(this.battleController.getView().getGroup());
    this.layer.add(this.resultsController.getView().getGroup());

    // Draw the layer (render everything to the canvas)
    this.layer.draw();

    // Start with login screen visible
    this.switchToScreen({ type: "login" });
  }

  /**
   * Switch to a different screen
   *
   * This method implements screen management by:
   * 1. Hiding all screens (setting their Groups to invisible)
   * 2. Showing only the requested screen
   *
   * This pattern ensures only one screen is visible at a time.
   */
  switchToScreen(screen: Screen): void {
    // Hide all screens first by setting their Groups to invisible
    this.loginController.hide();
    this.menuController.hide();
    this.cardsController.hide();
    this.battleController.hide();
    this.resultsController.hide();

    switch (screen.type) {
      case "login":
        this.loginController.show();
        break;

      case "menu":
        this.menuController.show();
        break;

      case "cards":
        this.cardsController.show();
        break;

      case "battle":
        this.battleController.startGame();
        break;

      case "results":
        this.resultsController.show();
        break;
    }
  }
}

// Initialize the application

// import './style.css';
// import Konva from 'konva';
// import { CardsScreenController } from './screens/CardsScreen/CardsScreenController';
// import { STAGE_WIDTH, STAGE_HEIGHT } from './constants';
// import type { Card, ScreenSwitcher, Screen } from './types';

// const MOCK_CARDS_DATA: Card[] = [
//   // 第 1 行 (Swordsman)
//   { id: 's1', name: 'Swordsman Lv.1', cost: 1, is_locked: false, imageUrl: '/menu_images/swordsman.png', description: 'A basic swordsman unit with balanced attack and defense.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 's2', name: 'Swordsman Lv.2', cost: 2, is_locked: true,  imageUrl: '/menu_images/swordsman.png', description: 'An upgraded swordsman with improved stats.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 's3', name: 'Swordsman Lv.3', cost: 3, is_locked: true,  imageUrl: '/menu_images/swordsman.png', description: 'An elite swordsman with superior combat abilities.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 's4', name: 'Swordsman Lv.4', cost: 4, is_locked: true,  imageUrl: '/menu_images/swordsman.png', description: 'A master swordsman, the pinnacle of melee combat.', tutorial_path: '/menu_images/tutorial.jpg' },
//   // 第 2 行 (Archer)
//   { id: 'a1', name: 'Archer Lv.1', cost: 1, is_locked: false, imageUrl: '/menu_images/archer.png', description: 'A basic archer unit with ranged attack capabilities.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 'a2', name: 'Archer Lv.2', cost: 2, is_locked: false, imageUrl: '/menu_images/archer.png', description: 'An upgraded archer with increased range and damage.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 'a3', name: 'Archer Lv.3', cost: 3, is_locked: true,  imageUrl: '/menu_images/archer.png', description: 'An elite archer with precision targeting.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 'a4', name: 'Archer Lv.4', cost: 4, is_locked: true,  imageUrl: '/menu_images/archer.png', description: 'A master archer, deadly from any distance.', tutorial_path: '/menu_images/tutorial.jpg' },
//   // 第 3 行 (Spearman)
//   { id: 'p1', name: 'Spearman Lv.1', cost: 1, is_locked: false, imageUrl: '/menu_images/spearman.png', description: 'A basic spearman unit with defensive capabilities.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 'p2', name: 'Spearman Lv.2', cost: 2, is_locked: false, imageUrl: '/menu_images/spearman.png', description: 'An upgraded spearman with enhanced defense.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 'p3', name: 'Spearman Lv.3', cost: 3, is_locked: false, imageUrl: '/menu_images/spearman.png', description: 'An elite spearman with superior defensive skills.', tutorial_path: '/menu_images/tutorial.jpg' },
//   { id: 'p4', name: 'Spearman Lv.4', cost: 4, is_locked: true,  imageUrl: '/menu_images/spearman.png', description: 'A master spearman, the ultimate defensive unit.', tutorial_path: '/menu_images/tutorial.jpg' },
// ];

// // Simple ScreenSwitcher implementation for testing
// const simpleScreenSwitcher: ScreenSwitcher = {
//   switchToScreen: (screen: Screen) => {
//     console.log('Switching to screen:', screen);
//     // For now, just log the screen switch
//     if (screen.type === 'menu') {
//       alert('Switching to menu screen');
//     }
//   }
// };

// // 1. 创建 Konva 舞台 (Stage)
// // 它会自动在 index.html 中寻找 id='container' 的 div
// const stage = new Konva.Stage({
//   container: 'container',
//   width: STAGE_WIDTH,
//   height: STAGE_HEIGHT,
// });

// // 2. 创建一个图层 (Layer)
// const layer = new Konva.Layer();
// stage.add(layer);

// // 3. 创建 CardsScreenController
// const cardsController = new CardsScreenController(simpleScreenSwitcher, MOCK_CARDS_DATA);

// // 4. 将视图的 Konva.Group 添加到图层中
// layer.add(cardsController.getView().getGroup());

// // 5. 将弹窗的 groups 添加到图层中
// const popupGroups = cardsController.getPopupGroups();
// popupGroups.forEach(popupGroup => {
//   layer.add(popupGroup);
// });

// // 6. 显示视图
// cardsController.getView().show();

// // 7. 绘制图层
// layer.draw();
 