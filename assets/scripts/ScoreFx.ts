import { _decorator, Component, Node, Vec3, Label, Color, math } from 'cc';
import { FxManager } from './managers/FxManager';
const { ccclass, property } = _decorator;

const duration: number = 2;
const startPos: Vec3 = new Vec3(0, 0, 0);
const targetPos: Vec3 = new Vec3(0, 20, 0);

@ccclass('ScoreFx')
export class ScoreFx extends Component {
  @property(Label)
  label: Label;

  private _playing: boolean = false;
  private _countTime: number = 0;
  private _curPos: Vec3 = new Vec3(0, 0, 0);
  private _defaultColor: Color = new Color();

  init = (worldPos: Vec3, targetTxt: string) => {
    this.node.setWorldPosition(worldPos);
    this.label.string = targetTxt;
    this._countTime = 0;
    this._playing = true;
    this.label.node.setPosition(Vec3.ZERO);
    this._defaultColor = new Color(
      this.label.color.r,
      this.label.color.g,
      this.label.color.b,
      255
    );
    this.label.color = this._defaultColor;
    this._curPos = this.label.node.position;
  };

  update(deltaTime: number) {
    if (this._playing) {
      this._countTime += deltaTime;
      Vec3.lerp(this._curPos, startPos, targetPos, this._countTime / duration);
      this._defaultColor.a = math.lerp(255, 0, this._countTime / duration);
      this.label.color = this._defaultColor;
      this.label.node.setPosition(this._curPos);
      if (this._countTime / duration >= 1) {
        this._playing = false;
        FxManager.Instance.returnFx(this);
      }
    }
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
