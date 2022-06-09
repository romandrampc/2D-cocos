import { _decorator, Component, Node, Prefab, Vec3, instantiate } from 'cc';
import { Bullet } from '../Bullet';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
  private static _instance: BulletManager;
  public static get instance(): BulletManager {
    return BulletManager._instance;
  }

  @property(Prefab)
  prefab: Prefab;
  @property(Node)
  parentNode: Node;
  @property(Number)
  coolDownTime = 0.0;
  @property(Number)
  bulletSpeed: number = 100;

  private _activeBullets: Bullet[] = [];
  private coolDownTimer: number = 0.0;
  private count: number = 0;

  onLoad() {
    BulletManager._instance = this;
  }

  start() {
    this.coolDownTimer = this.coolDownTime;
  }

  update(dt: number) {
    if (this.coolDownTimer < this.coolDownTime) this.coolDownTimer += dt;
  }

  generateBullet = (pos: Vec3) => {
    if (this.coolDownTimer < this.coolDownTime) return;

    let bullet: Bullet;

    const newNode = instantiate(this.prefab);
    bullet = newNode.getComponent(Bullet);

    bullet.node.setParent(this.parentNode);
    bullet.node.setWorldPosition(pos);
    this._activeBullets.push(bullet);
    bullet.BulletSpeed = this.bulletSpeed;
    bullet.init();

    this.coolDownTimer = 0;
  };

  returnObject = (obj: Bullet) => {
    this._activeBullets.splice(this._activeBullets.indexOf(obj), 1);
    obj.node.destroy();
  };

  gameOver() {
    if (this._activeBullets.length > 0)
      this._activeBullets.forEach((element) => {
        element.node.destroy();
      });

    this._activeBullets.length = 0;
  }
}
