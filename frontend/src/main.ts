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
new App("container");
