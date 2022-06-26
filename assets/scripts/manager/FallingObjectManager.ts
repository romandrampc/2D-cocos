import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  math,
  Vec3,
} from 'cc';
import { FallingObject } from '../FallingObject';
import { randomItems } from '../services/Utils';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('FallingObjectManager')
export class FallingObjectManager extends Component {
  private static _instance: FallingObjectManager;
  public static get instance(): FallingObjectManager {
    return FallingObjectManager._instance;
  }

  @property([Node])
  spawnPosNodes: Node[] = [];
  @property([Prefab])
  meteorPrefabs: Prefab[] = [];
  @property(Number)
  startSpeed: number = 100;
  @property(Number)
  rangeSpawn: number = 30;
  @property(Number)
  spawnRate: number = 30;
  @property(Boolean)
  isChanceNotSpawn: boolean = false;

  private _activeObjects: FallingObject[] = [];
  private _curFallSpeed: number = 0;
  private _MeteorSpawnTimer: number = 0;
  private _curMeteorSpawnTime: number = 0;
  private _curMeteorSpawner: number = -1;
  private _itemSpawnTimer: number = 0;
  private _curItemSpawnTime: number = 0;
  private _curItemSpawner: number = -1;

  public set CurVirusSpawnTime(val: number) {
    this._curMeteorSpawnTime = val;
  }

  public set CurItemSpawnTime(val: number) {
    this._curItemSpawnTime = val;
  }

  onLoad() {
    FallingObjectManager._instance = this;
  }

  init() {
    this._curFallSpeed = this.startSpeed;
    this._MeteorSpawnTimer = 0;
    this._itemSpawnTimer = 0;
  }

  update(dt: number) {
    if (GameManager.Instance.gameState === GameState.GAMEPLAY) {
      if (this._MeteorSpawnTimer < this._curMeteorSpawnTime) {
        this._MeteorSpawnTimer += dt;
      } else {
        this._MeteorSpawnTimer = 0;
        if (this.isChanceNotSpawn) {
          const gacha = Math.floor(Math.random() * 100);
          if (this.spawnRate > gacha) this.randomSpawn('Meteor');
        } else this.randomSpawn('Meteor');
      }

      if (this._itemSpawnTimer < this._curItemSpawnTime) {
        this._itemSpawnTimer += dt;
      } else {
        this._itemSpawnTimer = 0;
        if (this.isChanceNotSpawn) {
          const gacha = Math.floor(Math.random() * 100);
          if (this.spawnRate > gacha) this.randomSpawn('Item');
        } else this.randomSpawn('Item');
      }
    }
  }

  randomSpawnTarget(indexPreviousSpawn: number) {
    let targetSpawnPoint = randomItems([...this.spawnPosNodes], 1) as Node;
    while (
      indexPreviousSpawn === this.spawnPosNodes.indexOf(targetSpawnPoint)
    ) {
      targetSpawnPoint = randomItems([...this.spawnPosNodes], 1) as Node;
    }
    return targetSpawnPoint;
  }

  randomPos(obj: Node) {
    let curPos = new Vec3();
    obj.getWorldPosition(curPos);
    const posOrNeg = Math.floor(math.random() * 2);
    let pos = Math.random() * this.rangeSpawn;
    pos = posOrNeg === 0 ? pos * 1 : pos * -1;
    Vec3.add(curPos, Vec3.ZERO, new Vec3(pos, 0, 0));
    obj.setPosition(curPos);
  }

  randomSpawn = (targetObjType: string) => {
    let objComp: FallingObject;
    let spawnTarget: Node;
    let [targetPrefab]: Prefab[] = new Array();
    if (targetObjType === 'Meteor') {
      spawnTarget = this.randomSpawnTarget(this._curItemSpawner);
      targetPrefab = randomItems([...this.meteorPrefabs], 1) as Prefab;
    } else if (targetObjType === 'Item') {
      spawnTarget = this.randomSpawnTarget(this._curMeteorSpawner);
      // targetPrefab = randomItems([...this.ItemPrefabs], 1) as Prefab;
    }

    const newNode = instantiate(targetPrefab);
    objComp = newNode.getComponent(FallingObject);

    this._activeObjects.push(objComp);
    this._curMeteorSpawner = this.spawnPosNodes.indexOf(spawnTarget);

    objComp.FallSpeed = this._curFallSpeed;
    objComp.node.setParent(spawnTarget, false);
    objComp.node.setPosition(Vec3.ZERO);
    this.randomPos(objComp.node);
    objComp.init();
  };

  returnObject = (obj: FallingObject) => {
    this._activeObjects.splice(this._activeObjects.indexOf(obj), 1);
    obj.node.destroy();
  };

  gameOver() {
    if (this._activeObjects.length > 0)
      this._activeObjects.forEach((element) => {
        element.node.destroy();
      });

    this._activeObjects.length = 0;
  }
}
