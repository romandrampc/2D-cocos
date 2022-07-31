import { _decorator, Component, Node, Animation } from 'cc';
import { FxManager } from './managers/FxManager';
const { ccclass, property } = _decorator;

@ccclass('BombFx')
export class BombFx extends Component {
  _fxManager: FxManager;
  playAnim(fxMana: FxManager) {
    this._fxManager = fxMana;
    const anim = this.node.getComponent(Animation);
    anim.play();
  }

  onAnimComplete(isComplete: boolean) {
    if (isComplete) this._fxManager.returnBombFx(this);
  }
}
