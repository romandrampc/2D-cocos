import { _decorator, Component, Node, PlaneCollider } from 'cc';
import { PlayerController } from '../controllers/PlayerController';
import { FallingObjManager } from './FallingObjManager';
const { ccclass, property } = _decorator;

export enum GAMESTATE {
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

  public gameState: GAMESTATE = GAMESTATE.START;

  onLoad() {
    GameManager._instance = this;
    this.gameState = GAMESTATE.START;
  }

  start() {
    PlayerController.Instance.init(this);
    FallingObjManager.Instance.init()
    this.gameState = GAMESTATE.GAMEPLAY;
  }
}
