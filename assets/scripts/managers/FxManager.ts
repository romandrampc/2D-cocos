import { _decorator, Component, Node, Prefab, Vec3, instantiate } from 'cc';
import { ScoreFx } from '../ScoreFx';
const { ccclass, property } = _decorator;

@ccclass('FxManager')
export class FxManager extends Component {
  private static _instance: FxManager;

  public static get Instance(): FxManager {
    return FxManager._instance;
  }

  @property(Prefab)
  scorePrefab: Prefab;
  @property(Node)
  fxParent: Node;

  private _activeFxArray: ScoreFx[] = [];

  onLoad() {
    FxManager._instance = this;
  }

  showFx = (worldPos: Vec3, txt: string) => {
    let fx: ScoreFx;

    const newNode = instantiate(this.scorePrefab);
    newNode.setParent(this.fxParent);
    fx = newNode.getComponent(ScoreFx);
    fx.init(worldPos, txt);
    this._activeFxArray.push(fx);
  };

  returnFx = (fx: ScoreFx) => {
    this._activeFxArray.splice(this._activeFxArray.indexOf(fx));
    fx.node.destroy();
  };

  gameOver() {
    if (this._activeFxArray.length > 0)
      this._activeFxArray.forEach((fx) => {
        fx.node.destroy();
      });

    this._activeFxArray.length = 0;
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
