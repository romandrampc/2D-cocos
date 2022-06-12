import {
  _decorator,
  Component,
  Node,
  PhysicsSystem2D,
  systemEvent,
  SystemEvent,
  EventMouse,
  EventTouch,
  Touch,
  Vec3,
  math,
} from 'cc';
import { GameManager, GAMESTATE } from '../managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private static _instance: PlayerController;

  public static get Instance() {
    return PlayerController._instance;
  }

  @property(Number)
  minX: number = 0;
  @property(Number)
  maxX: number = 0;
  @property(Node)
  bulletSpawnPoint: Node;

  private _gameManager: GameManager;
  isMovingLeft: boolean = false;
  isMovingRight: boolean = false;
  isSet: boolean = false;

  onLoad() {
    PlayerController._instance = this;
  }

  init(gameMana: GameManager) {
    this._gameManager = gameMana;
    PhysicsSystem2D.instance.enable = true;

    systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
    systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);

    console.log('test1');
  }

  onDestroy() {
    systemEvent.off(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
    systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchEnd(touch: Touch, event: EventTouch) {
    if (this._gameManager.gameState !== GAMESTATE.GAMEPLAY) return;
    const worldPos = this.node.getWorldPosition();
    const touchPos = touch.getUILocation();
    const diffPos = Math.abs(worldPos.x - touchPos.x);
    if (diffPos < 1) {
      const newWorldPos = this.bulletSpawnPoint.getWorldPosition();
      // SpawnBullet
    } else {
      if (touchPos.x <= this.minX) {
        this.node.setWorldPosition(new Vec3(this.minX, worldPos.y, worldPos.z));
      } else if (touchPos.x >= this.maxX) {
        this.node.setWorldPosition(new Vec3(this.maxX, worldPos.y, worldPos.z));
      } else {
        this.node.setWorldPosition(
          new Vec3(touchPos.x, worldPos.y, worldPos.z)
        );
      }
      const newWorldPos = this.bulletSpawnPoint.getWorldPosition();
      // SpawnBullet
    }
  }

  onMouseMove(event: EventMouse) {
    if (this._gameManager.gameState === GAMESTATE.GAMEPLAY) {
      const oldWorldPos = this.node.getWorldPosition();
      const newWorldPos = event.getUILocation();

      if (oldWorldPos.x > newWorldPos.x) {
        if (!this.isMovingLeft) this.isMovingLeft = true;
      } else if (oldWorldPos.x < newWorldPos.x) {
        if (!this.isMovingRight) this.isMovingRight = true;
      }

      this.node.setWorldPosition(
        new Vec3(
          math.clamp(newWorldPos.x, this.minX, this.maxX),
          oldWorldPos.y,
          oldWorldPos.z
        )
      );

      if ((this.isMovingLeft || this.isMovingRight) && !this.isSet) {
        this.isSet = true;
        this.scheduleOnce(() => {
          this.isMovingLeft = false;
          this.isMovingRight = false;
          this.isSet = false;
        }, 0.5);
      }
    }
  }
}
