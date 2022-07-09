import {
  _decorator,
  Component,
  Node,
  BoxCollider2D,
  Vec3,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from 'cc';
import { FallingObj } from './FallingObj';
import { BulletManager } from './managers/BulletManager';
import { GameManager, GAMESTATE } from './managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
  private _speed: number = 200;
  private _collider: BoxCollider2D;

  private _isInit: boolean = false;
  private _curPos: Vec3 = new Vec3();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  private _isBulletCrash: boolean = false;

  public set BulletSpeed(val: number) {
    this._speed = val;
  }

  onLoad() {
    this._collider = this.getComponent(BoxCollider2D);
    this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  onDestroy() {
    this._collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  init() {
    this._isInit = true;
    this._isBulletCrash = false;
  }

  lateUpdate(dt: number) {
    if (this._isInit && GameManager.Instance.gameState === GAMESTATE.GAMEPLAY) {
      this.node.getWorldPosition(this._curPos);
      this._deltaPos.y = this._speed * dt;
      Vec3.add(this._curPos, this._curPos, this._deltaPos);
      this.node.setWorldPosition(this._curPos);
      if (this._curPos.y > 1200) {
        this._isInit = false;
        this.scheduleOnce(() => this.destroyBullet(), 0.0001);
      }
    }
  }

  destroyBullet() {
    this.node.setWorldPosition(new Vec3(3000, 0, 0));
    BulletManager.Instance.removeBullet(this);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    const fallObj = otherCollider.getComponent(FallingObj);
    if (fallObj && !this._isBulletCrash) {
      this._isInit = false;
      this._isBulletCrash = true;
      const worldPos = otherCollider.node.getWorldPosition();
      GameManager.Instance.onBulletCrashTarget(fallObj.type, worldPos);
      this.scheduleOnce(() => this.destroyBullet(), 0.0001);
    }
  }
}
