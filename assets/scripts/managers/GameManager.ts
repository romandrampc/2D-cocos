import { _decorator, Component, Node, PlaneCollider, Vec3 } from 'cc';
import { METEOR } from '../Configs/FallObjConfigs';
import { PlayerController } from '../controllers/PlayerController';
import { FallingObjManager } from './FallingObjManager';
import { FxManager } from './FxManager';
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
    FallingObjManager.Instance.init();
    this.gameState = GAMESTATE.GAMEPLAY;
  }

  onBulletCrashTarget(targetId: string, pos: Vec3) {
    switch (targetId) {
      case METEOR:
        console.log('hit');
        FxManager.instance.showScoreFx(pos, 'Hit');
        FxManager.instance.showBombFx(pos);
        break;
    }
  }
}
