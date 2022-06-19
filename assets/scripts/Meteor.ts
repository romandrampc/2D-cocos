import { _decorator, Component, Node, Vec3, Quat, BoxCollider2D } from 'cc';
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
}
