import {
  _decorator,
  Component,
  Node,
  PlaneCollider,
  Vec3,
  Label,
  math,
} from 'cc';
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

  @property(Number)
  waitTimeBeforeStart: number = 0;
  @property(Label)
  timerTxt: Label;

  private _timer: number = 0;

  onLoad() {
    GameManager._instance = this;
    this.gameState = GAMESTATE.START;
  }

  update(deltaTime: number) {
    if (this.gameState === GAMESTATE.START) {
      this._timer += deltaTime;
      const showTime = Math.ceil(this.waitTimeBeforeStart - this._timer);
      this.timerTxt.string = showTime.toString();

      if (this._timer / this.waitTimeBeforeStart >= 1) {
        PlayerController.Instance.init(this);
        FallingObjManager.Instance.init();
        this.gameState = GAMESTATE.GAMEPLAY;
        this.timerTxt.string = '';
      }
    }
  }

  onBulletCrashTarget(targetId: string, pos: Vec3) {
    switch (targetId) {
      case METEOR:
        FxManager.Instance.showFx(pos, 'Hit');
        break;
    }
  }
}
