import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, WSResponse } from "../../types.ts";
import { BattleScreenModel } from "./BattleScreenModel.ts";
import { BattleScreenView } from "./BattleScreenView.ts";
import { MAX_CARDS_SELECTED, BATTLE_DURATION } from "../../constants.ts";
const BACKEND_URI = "http://localhost:8080";
/**
 * BattleScreenController - Coordinates battle logic between Model and View
 */
export class BattleScreenController extends ScreenController {
  private model: BattleScreenModel;
  private view: BattleScreenView;
  private screenSwitcher: ScreenSwitcher;
  private battleTimer: number | null = null;
  private currentCardType: string | null = null;
  private isCorrect: boolean | null = null;
  private isBlueTeam: boolean = false;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new BattleScreenModel();
    this.view = new BattleScreenView(
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
    if (!this.isBlueTeam) {
      for (const troop of data.troops) {
        troop.Team = troop.Team === 1 ? 1 : 0;
        troop.Position = this.flipBoardPosition(
          troop.Position,
        );
      }
    }
    return data;
  }
  /** 
   * Fetch and update battle state using ws
   */
  async fetchAndUpdateBattleState(): Promise<void> {
    // Fetch game id from backend
    fetch("http://localhost:8080/newgame", {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        const roomID = data.roomID;

        // asynchronously pull and update tiles
        const ws = new WebSocket(`${BACKEND_URI}/ws/${roomID}`);
        ws.onopen = () => {
                ws.send(JSON.stringify({
                  team: "red",
                  troopType: "CavalryOne",
                  x: 2,
                  y: 2
                }));
        }
        ws.onmessage = (event) => {
          const data: WSResponse = this.marshalWSData(JSON.parse(event.data));
          this.model.updateTiles(data.troops);
          this.view.rerenderTroops(this.model.getTiles());
        };
      });
  }

  /**
   * Start the battle
   */
  startBattle(): void {
    // Reset model state
    this.model.reset();

    this.fetchAndUpdateBattleState();
    // Update view
    // this.view.updateScore(this.model.getPoints());
    this.view.updateTimer(BATTLE_DURATION);
    this.view.show();

    this.startTimer();
  }


  /**
   * Start the countdown timer
   */
  private startTimer(): void {
    let timeRemaining = BATTLE_DURATION;
    this.battleTimer = setInterval(() => {
      timeRemaining -= 1;
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
    console.log("entered card click handler");
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
      /*
      this.model.spawnTroop(this.currentCardType, 0, 2, 7);
      this.view.renderTroop(this.currentCardType);*/
    }

    this.isCorrect = null;
    this.currentCardType = null;
  }

  /**
   * Sets the cards the user selected
   */
  private setCards(cards: string[] | number[]) {
    if (cards.length !== MAX_CARDS_SELECTED) {
      console.error(
        `BattleScreenController: Expected ${MAX_CARDS_SELECTED} cards, got ${cards.length}`,
      );
      return;
    }

    this.view.addCards(cards);
  }

  /**
   * End the battle
   */
  private endBattle(reason: "leave" | "complete"): void {
    this.stopTimer();

    if (reason === "leave") {
      console.log("Now going to menu screen");
      this.screenSwitcher.switchToScreen({ type: "menu" });
      return;
    }

    console.log("Now going to results screen");
    this.screenSwitcher.switchToScreen({
      type: "result",
      points: this.model.getPoints(),
    });
  }

  /**
   * Get the view group
   */
  getView(): BattleScreenView {
    return this.view;
  }
}
