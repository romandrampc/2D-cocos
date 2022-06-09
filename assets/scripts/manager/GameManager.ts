import { _decorator, Component, Node } from 'cc';
import { PlayerController } from '../controller/PlayerController';
const { ccclass, property } = _decorator;

export enum GameState {
  START,
  GAMEPLAY,
  GAMEOVER,
  PAUSE,
}

@ccclass('GameManager')
export class GameManager extends Component {
  private static _instance: GameManager;

  public static get Instance() {
    return GameManager._instance;
  }

  public gameState: GameState = GameState.START;

  onLoad() {
    GameManager._instance = this;
    this.gameState = GameState.START;
  }

  start() {
    PlayerController.Instance.init(this);
  }
}
