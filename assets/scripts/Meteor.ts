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
import { GameManager, GAMESTATE } from './managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Meteor')
export class Meteor extends Component {
  private _isInit: boolean;
  private _curPos: Vec3 = new Vec3();
  private _curRotEuler: Vec3 = new Vec3();
  private _curRotQuat: Quat = new Quat();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  private _deltaRot: Vec3 = new Vec3(0, 0, 0);
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
      this.node.getWorldRotation(this._curRotQuat);
      this._deltaPos.y = -this._fallSpeed * dt;
      this._deltaRot.z = this._rotateSpeed * dt;
      this._curRotQuat.getEulerAngles(this._curRotEuler);
      console.log(this._rotateSpeed * dt);

      Vec3.add(this._curPos, this._curPos, this._deltaPos);
      Vec3.add(this._curRotEuler, this._curRotEuler, this._deltaRot);
      this.node.setWorldPosition(this._curPos);
      this.node.setRotationFromEuler(this._curRotEuler);
      if (this._curPos.y < -100) {
        this._isInit = false;
        //TODO: return manager
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
    //TODO: return manager
  }
}
