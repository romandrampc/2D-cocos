import {
  _decorator,
  Component,
  Node,
  PhysicsSystem2D,
  SystemEvent,
  systemEvent,
  EventTouch,
  Touch,
  Vec3,
  EventMouse,
  math,
} from 'cc';
import { GameManager, GameState } from '../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private static _instance: PlayerController;

  public static get Instance() {
    return PlayerController._instance;
  }
  @property(Number)
  minX: number = 100;
  @property(Number)
  maxX: number = 620;
  @property(Node)
  bulletSpawnPoint: Node;

  private _gameManager: GameManager;
  isMovingLeft = false;
  isMovingRight = false;
  isSet = false;

  onLoad() {
    PlayerController._instance = this;
  }

  init(gameManager: GameManager) {
    this._gameManager = gameManager;
    PhysicsSystem2D.instance.enable = true;

    systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
    systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onDestroy() {
    systemEvent.off(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
    systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  private onTouchEnd(touch: Touch, event: EventTouch) {
    const worldPos = this.node.getWorldPosition();
    const touchPos = touch.getUILocation();
    const diffPos = Math.abs(worldPos.x - touchPos.x);

    if (diffPos < 1) {
      const newWorldPos = this.bulletSpawnPoint.getWorldPosition();
      // BulletManager.instance.generateBullet(newWorldPos);
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
      // BulletManager.instance.generateBullet(newWorldPos);
    }
  }

  onMouseMove(event: EventMouse) {
    if (GameManager.Instance.gameState === GameState.GAMEPLAY) {
      const oldWorldPos = this.node.getWorldPosition();
      const newWorldPos = event.getUILocation();

      if (oldWorldPos.x > newWorldPos.x) {
        if (!this.isMovingLeft) {
          this.isMovingLeft = true;
        }
      } else if (oldWorldPos.x < newWorldPos.x) {
        if (!this.isMovingRight) {
          this.isMovingRight = true;
        }
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
