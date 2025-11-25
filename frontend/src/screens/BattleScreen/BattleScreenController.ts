import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, WSResponse } from "../../types.ts";
import { BattleScreenModel } from "./BattleScreenModel.ts";
import { BattleScreenView } from "./BattleScreenView.ts";
import { BATTLE_DURATION } from "../../constants.ts";

const BACKEND_URI = "http://localhost:8080";

/**
 * BattleScreenController - Coordinates battle logic between Model and View
 */
export class BattleScreenController extends ScreenController {
  private model: BattleScreenModel;
  private view: BattleScreenView;
  private screenSwitcher: ScreenSwitcher;
  private selectedCards: string[] = [];
  private battleTimer: number | null = null;
  private currentCardType: string | null = null;
  private isCorrect: boolean | null = null;
  private isMatchReady: boolean = false;
  private callSpawnTroop?: (troop: string, x: number, y: number) => void;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new BattleScreenModel();
    this.view = new BattleScreenView(
      this.model,
      () => this.handleHomeClick(),
      () => this.handleLeaveClick(),
      () => this.handleContinueClick(),
      (cardType: string) => this.handleCardClick(cardType),
      () => this.handleQuitClick(),
      (answer: number, remainder?: number) =>
        this.handleSubmitClick(answer, remainder),
      () => this.handleOkayClick(),
    );
  }

  private flipBoardPosition(Position: Position) {
    return {
      X: Position.X,
      Y: this.model.SIZE - 1 - Position.Y,
    };
  }
  /**
   * Marshal websocket data to match current team
   */
  private marshalWSData(data: WSResponse): WSResponse {
    // Implement marshaling logic here
    if (!this.model.isBlueTeam) {
      for (const troop of data.troops) {
        troop.Team = troop.Team === 1 ? 1 : 0;
        troop.Position = this.flipBoardPosition(troop.Position);
      }
    }
    return data;
  }
  /**
   * Fetch and update battle state using ws
   */
  async fetchAndUpdateBattleState(): Promise<void> {
    // Connect to matchmaking WebSocket
    const matchWS = new WebSocket(`${BACKEND_URI}/newgamews`);

    matchWS.onopen = () => {
      console.log("Connected to matchmaking server...");
    };

    matchWS.onmessage = (event) => {
      const msg = JSON.parse(event.data) as {
        type: string;
        roomID: string;
        team: string;
      };

      if (msg.type === "matched") {
        // Save team info
        this.model.isBlueTeam = msg.team === "blue";

        this.isMatchReady = true;

        // Start the timer ONLY when both players matched
        this.startTimer();

        // Open the actual battle WebSocket
        const ws = new WebSocket(`${BACKEND_URI}/ws/${msg.roomID}`);

        ws.onopen = () => {
          // setup troop spawning callback
          this.callSpawnTroop = (troop: string, x: number, y: number) => {
            this.model.setTroopToPlace(null);
            const position = this.model.isBlueTeam
              ? { X: x, Y: y }
              : this.flipBoardPosition({ X: x, Y: y });
            ws.send(
              JSON.stringify({
                team: this.model.isBlueTeam ? "blue" : "red",
                troopType: troop,
                x: position.X,
                y: position.Y,
              }),
            );
          };
          this.view.setCallSpawnTroop(this.callSpawnTroop!);
        };

        ws.onmessage = (event) => {
          const data: WSResponse = this.marshalWSData(JSON.parse(event.data));
          this.model.updateTiles(data.troops);
          this.view.rerenderTroops(this.model.getTiles());
        };

        // Close matchmaking WS after match
        matchWS.close();
      }
    };
  }

  /**
   * Start the battle
   */
  startBattle(): void {
    // Reset model state
    this.model.reset();

    this.fetchAndUpdateBattleState();
    // Update view
    this.view.updateTimer(BATTLE_DURATION);
    this.view.show();
  }

  /**
   * Start the countdown timer
   */
  private startTimer(): void {
    let timeRemaining = BATTLE_DURATION;
    console.log("Starting timer with seconds:", timeRemaining);
    this.battleTimer = setInterval(() => {
      timeRemaining -= 1;
      console.log("Starting timer with seconds:", timeRemaining);
      this.view.updateTimer(timeRemaining);
      if (timeRemaining <= 0) {
        this.endBattle("complete");
      }
    }, 1000);
  }

  /**
   * Stop the timer
   */
  private stopTimer(): void {
    if (this.battleTimer !== null) {
      clearInterval(this.battleTimer);
      this.battleTimer = null;
    }
  }

  /**
   * Sets the cards the user selected
   */
  public setCards(cards: string[]) {
    this.selectedCards = cards;
    this.view.renderCards(this.selectedCards, (cardType) =>
      this.handleCardClick(cardType),
    );
  }

  /**
   * Handle home button click
   */
  private handleHomeClick(): void {
    console.log("entered home click handler");
    this.view.showConfirmPopup(
      () => this.handleLeaveClick(),
      () => this.handleContinueClick(),
    );
  }

  /**
   * Handle continue button click for battle
   */
  private handleContinueClick(): void {
    console.log("entered continue click handler");
  }

  /**
   * Handle leave button click for home
   */
  private handleLeaveClick(): void {
    console.log("entered leave click handler");
    this.endBattle("leave");
  }

  /**
   * Handle card click
   */
  private handleCardClick(cardType: string): void {
    console.log(`entered card click handler with ${cardType}`);

    // Only allow cards to be clicked when both players are available
    if (!this.isMatchReady) {
      console.log("Cannot click cards yet — waiting for second player");
      return;
    }

    this.currentCardType = cardType;
    const problem = this.model.generateProblem(cardType);
    const operation = this.model.getCardOperation(cardType);

    this.view.showMathPopup(
      operation,
      problem.question,
      () => this.handleQuitClick(),
      (answer, remainder?) => this.handleSubmitClick(answer, remainder),
      () => this.handleOkayClick(),
    );
  }

  /**
   * Handle quit button click for math problem
   */
  private handleQuitClick(): void {
    console.log("entered quit click handler for math problem");
    this.isCorrect = null;
    this.currentCardType = null;
  }

  /**
   * Handle submit button click for math problem
   */
  private handleSubmitClick(userAnswer: number, userRemainder?: number): void {
    console.log("entered submit click handler for math problem");
    const problem = this.model.getCurrentProblem();
    if (!problem) return;

    this.isCorrect = this.model.checkAnswer(userAnswer, userRemainder);
    const operation = this.model.getCardOperation(this.currentCardType);
    console.log("checked answer");
    this.view.showFeedback(
      operation,
      problem.answer,
      problem.remainder,
      this.isCorrect,
    );
  }

  /**
   * Handle okay button click for math problem
   */
  private handleOkayClick(): void {
    console.log("entered okay click handler for math problem");

    if (this.isCorrect) {
      console.log("correct!");
      this.model.setTroopToPlace(this.currentCardType);
    }

    this.isCorrect = null;
    this.currentCardType = null;
  }

  /**
   * End the battle
   */
  private endBattle(reason: "leave" | "complete"): void {
    this.stopTimer();

    this.isCorrect = null;
    this.currentCardType = null;
    this.isMatchReady = false;

    if (reason === "leave") {
      console.log("Now going to menu screen");
      this.screenSwitcher.switchToScreen({ type: "menu" });
      return;
    }

    console.log("Now going to results screen");
    this.screenSwitcher.switchToScreen({
      type: "result",
    });
  }

  /**
   * Get the view group
   */
  getView(): BattleScreenView {
    return this.view;
  }
}
