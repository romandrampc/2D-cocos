import { _decorator, Component, Node, Prefab, Vec3, instantiate } from 'cc';
import { METEOR } from '../Configs/FallObjConfigs';
import { FallingObj } from '../FallingObj';
import { Meteor } from '../Meteor';
import { randomItems } from '../services/Utils';
import { GameManager, GAMESTATE } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('FallingObjManager')
export class FallingObjManager extends Component {
  private static _instance: FallingObjManager;

  public static get Instance(): FallingObjManager {
    return this._instance;
  }

  @property([Node])
  spawnPosNodes: Node[] = [];
  @property([Prefab])
  meteorPrefab: Prefab[] = [];
  @property(Number)
  startSpeed: number = 100;
  @property(Number)
  rangeSpawn = 50;
  @property(Number)
  spawnRate: number = 30;
  @property(Boolean)
  isChanceNotSpawn: boolean = false;
  @property(Number)
  meteorSpawnTime: number = 1;

  private _activeFallingObj: FallingObj[] = [];
  private _curMetoerFallSpeed: number = 0;
  private _meteorSpawnTimer: number = 0;
  private _previousSlotFallIndex: number = -1;

  public set MeteorFallSpeed(val: number) {
    this._curMetoerFallSpeed = val;
  }
  onLoad() {
    FallingObjManager._instance = this;
  }

  init() {
    this._curMetoerFallSpeed = this.startSpeed;
    this._meteorSpawnTimer = 0;
  }

  update(dt: number) {
    if (GameManager.Instance.gameState === GAMESTATE.GAMEPLAY) {
      if (this._meteorSpawnTimer < this.meteorSpawnTime) {
        this._meteorSpawnTimer += dt;
      } else {
        this._meteorSpawnTimer = 0;
        if (this.isChanceNotSpawn) {
          const gacha = Math.floor(Math.random() * 100);
          if (this.spawnRate > gacha) {
            this.randomSpawn(METEOR);
          }
        } else {
          this.randomSpawn(METEOR);
        }
      }
    }
  }

  randomSpawnTarget(indexPreviousSpawn: number) {
    let arrayTargetSpawnerPoints = randomItems(
      [...this.spawnPosNodes],
      1
    ) as Node[];
    let targetSpawnerPoint = arrayTargetSpawnerPoints.shift();
    while (
      indexPreviousSpawn === this.spawnPosNodes.indexOf(targetSpawnerPoint)
    ) {
      arrayTargetSpawnerPoints = randomItems(
        [...this.spawnPosNodes],
        1
      ) as Node[];
      targetSpawnerPoint = arrayTargetSpawnerPoints.shift();
    }
    return targetSpawnerPoint;
  }

  randomPos(obj: Node) {
    let curSpawnPos = new Vec3();
    obj.getWorldPosition(curSpawnPos);
    const posOrNegChance = Math.floor(Math.random() * 2);
    let pos = Math.random() * this.rangeSpawn;
    pos = posOrNegChance === 0 ? pos : pos * -1;
    Vec3.add(curSpawnPos, curSpawnPos, new Vec3(pos, 0, 0));
    obj.setWorldPosition(curSpawnPos);
  }

  randomSpawn(targetObjType: string) {
    let fallObj: FallingObj;
    let spawnerTarget: Node;
    let targetPrefab: Prefab;
    if (targetObjType === METEOR) {
      let array = randomItems([...this.meteorPrefab], 1);
      targetPrefab = array.shift();
    }
    spawnerTarget = this.randomSpawnTarget(this._previousSlotFallIndex);

    const newNode = instantiate(targetPrefab);
    fallObj = newNode.getComponent(FallingObj);
    this._activeFallingObj.push(fallObj);
    this._previousSlotFallIndex = this.spawnPosNodes.indexOf(spawnerTarget);
    if (targetObjType === METEOR) {
      fallObj.FallSpeed = this._curMetoerFallSpeed;
    }
    fallObj.node.setParent(spawnerTarget, false);
    fallObj.node.setPosition(Vec3.ZERO);
    this.randomPos(fallObj.node);
    fallObj.init();
  }

  returnObject = (obj: FallingObj) => {
    this._activeFallingObj.slice(this._activeFallingObj.indexOf(obj), 1);
    obj.node.destroy();
  };

  gameOver() {
    if (this._activeFallingObj.length > 0) {
      this._activeFallingObj.forEach((item) => {
        item.node.destroy();
      });

      this._activeFallingObj.length = 0;
    }
  }
}
