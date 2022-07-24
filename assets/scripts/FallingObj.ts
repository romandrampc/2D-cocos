import {
  _decorator,
  Component,
  Node,
  Vec3,
  Quat,
  BoxCollider2D,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from 'cc';
import { Bullet } from './Bullet';
import { FallingObjManager } from './managers/FallingObjManager';
import { GameManager, GAMESTATE } from './managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('FallingObj')
export class FallingObj extends Component {
  @property(String)
  type: string;

  private _isInit: boolean;
  private _curPos: Vec3 = new Vec3();
  private _curRotEuler: number = 0;
  //private _curRotQuat: Quat = new Quat();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  //private _deltaRot: Vec3 = new Vec3(0, 0, 0);
  private _fallSpeed: number = 120;
  private _rotateSpeed: number = 20;
  private _collider: BoxCollider2D;

  public set FallSpeed(val: number) {
    this._fallSpeed = val;
  }

  public get FallSpeed() {
    return this._fallSpeed;
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
  }

  lateUpdate(dt: number) {
    if (this._isInit && GameManager.Instance.gameState === GAMESTATE.GAMEPLAY) {
      this.node.getWorldPosition(this._curPos);
      this._deltaPos.y = -this._fallSpeed * dt;
      Vec3.add(this._curPos, this._curPos, this._deltaPos);
      this.node.setWorldPosition(this._curPos);

      this._curRotEuler += this._rotateSpeed * dt;
      if (this._curRotEuler >= 360) this._curRotEuler = 0;
      this.node.setRotationFromEuler(new Vec3(0, 0, this._curRotEuler));
      console.log(this._curPos);
      if (this._curPos.y < -100) {
        this._isInit = false;
        this.scheduleOnce(this.onReturnToDestroy, 0.001);
      }
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    const bullet = otherCollider.getComponent(Bullet);
    if (bullet) {
      this._isInit = false;
      this.scheduleOnce(this.onReturnToDestroy, 0.00001);
    }
  }

  onReturnToDestroy() {
    this.node.setPosition(new Vec3(1000, 1000, 0));
    FallingObjManager.Instance.returnObject(this);
  }
}
