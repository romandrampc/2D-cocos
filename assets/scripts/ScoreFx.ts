import { _decorator, Component, Node, Label, Vec3, Color, math } from 'cc';
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
  private _cntTime: number = 0;
  private _curPos: Vec3 = new Vec3(0, 0, 0);
  private _defaultColor: Color = new Color();

  init = (worldPos: Vec3, score: string) => {
    this.node.setWorldPosition(worldPos);
    this.label.string = score;
    this._cntTime = 0;
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
      this._cntTime += deltaTime;
      Vec3.lerp(this._curPos, startPos, targetPos, this._cntTime / duration);
      this._defaultColor.a = math.lerp(255, 0, this._cntTime / duration);
      this.label.color = this._defaultColor;
      this.label.node.setPosition(this._curPos);
      if (this._cntTime / duration >= 1) {
        this._playing = false;
        FxManager.instance.returnScoreFx(this);
      }
    }
  }
}
