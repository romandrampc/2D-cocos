import {
  _decorator,
  Component,
  Node,
  Vec3,
  BoxCollider2D,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  Quat,
} from 'cc';
import { Bullet } from './Bullet';
import { FallingObjectManager } from './manager/FallingObjectManager';
import { GameManager, GameState } from './manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('FallingObject')
export class FallingObject extends Component {
  @property
  id: string = '';
  @property(String)
  type: string = '';

  private _isInit: boolean = false;
  private _curPos: Vec3 = new Vec3();
  private _curRotVec3: Vec3 = new Vec3();
  private _curRotQuat: Quat = new Quat();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  private _deltaRot: Vec3 = new Vec3(0, 0, 0);
  private _fallSpeed: number = 120;
  private _rotateSpeed: number = 20;
  private _collider: BoxCollider2D;

  public get FallSpeed() {
    return this._fallSpeed;
  }

  public set FallSpeed(val: number) {
    this._fallSpeed = val;
  }

  public set IsInit(val: boolean) {
    this.IsInit = val;
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
    if (this._isInit && GameManager.Instance.gameState === GameState.GAMEPLAY) {
      this.node.getWorldPosition(this._curPos);
      this.node.getWorldRotation(this._curRotQuat);
      this._deltaPos.y = -this._fallSpeed * dt;
      this._deltaRot.z = this._rotateSpeed * dt;
      this._curRotQuat.getEulerAngles(this._curRotVec3);

      Vec3.add(this._curPos, this._curPos, this._deltaPos);
      Vec3.add(this._curRotVec3, this._curRotVec3, this._deltaRot);
      this.node.setWorldPosition(this._curPos);

      this.node.setRotationFromEuler(this._curRotVec3);
      if (this._curPos.y < -100) {
        this._isInit = false;
        FallingObjectManager.instance.returnObject(this)
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
      this.scheduleOnce(this.setPos, 0.000001);
    }
  }

  setPos = () => {
    this.node.setPosition(Vec3.ZERO);
   
    FallingObjectManager.instance.returnObject(this)
  };

  resetFall() {
    this._isInit = false;
    this.scheduleOnce(this.setPos, 0.000001);
  }
}
