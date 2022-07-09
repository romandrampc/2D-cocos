import { _decorator, Component, Node, Prefab, Vec3, instantiate } from 'cc';
import { Bullet } from '../Bullet';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
  private static _instance: BulletManager;

  public static get Instance(): BulletManager {
    return BulletManager._instance;
  }

  @property(Prefab)
  bulletPrefab: Prefab;
  @property(Node)
  bulletParentNode: Node;
  @property(Number)
  coolDownTime = 0.0;
  @property(Number)
  bulletSpeed: number = 200;

  private _activeBullets: Bullet[] = [];
  private coolDownTimer: number = 0.0;

  onLoad() {
    BulletManager._instance = this;
  }

  update(dt: number) {
    if (this.coolDownTimer > 0) this.coolDownTimer -= dt;
  }

  generateBullet(pos: Vec3) {
    if (this.coolDownTimer > 0) return;

    this.coolDownTimer = this.coolDownTime;

    let bullet: Bullet;
    const newNode = instantiate(this.bulletPrefab);
    bullet = newNode.getComponent(Bullet);

    bullet.node.setParent(this.bulletParentNode);
    bullet.node.setWorldPosition(pos);
    this._activeBullets.push(bullet);
    bullet.BulletSpeed = this.bulletSpeed;
    bullet.init();
  }

  removeBullet(bullet: Bullet) {
    this._activeBullets.splice(this._activeBullets.indexOf(bullet), 1);
    bullet.node.destroy();
  }

  gameOver() {
    if (this._activeBullets.length > 0) {
      this._activeBullets.forEach((bullet) => {
        bullet.node.destroy();
      });
    }

    this._activeBullets.length = 0;
  }
}
