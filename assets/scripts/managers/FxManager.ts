import { _decorator, Component, Node, Prefab, Vec3, instantiate } from 'cc';
import { ScoreFx } from '../ScoreFx';
const { ccclass, property } = _decorator;

@ccclass('FxManager')
export class FxManager extends Component {
  private static _instance: FxManager;

  public static get instance(): FxManager {
    return FxManager._instance;
  }

  @property(Prefab)
  scorePrefab: Prefab;
  @property(Node)
  scoreParent: Node;

  private _activeScoreFxArray: ScoreFx[] = [];

  onLoad() {
    FxManager._instance = this;
  }

  showScoreFx = (worldPos: Vec3, txt: string) => {
    let fx: ScoreFx;

    const newNode = instantiate(this.scorePrefab);
    newNode.setParent(this.scoreParent);
    fx = newNode.getComponent(ScoreFx);

    fx.init(worldPos, txt);
    this._activeScoreFxArray.push(fx);
  };

  returnScoreFx = (fx: ScoreFx) => {
    this._activeScoreFxArray.splice(this._activeScoreFxArray.indexOf(fx), 1);
    fx.node.destroy();
  };

  gameOver() {
    if (this._activeScoreFxArray.length > 0)
      this._activeScoreFxArray.forEach((element) => {
        element.node.destroy();
      });

    this._activeScoreFxArray.length = 0;
  }
}
