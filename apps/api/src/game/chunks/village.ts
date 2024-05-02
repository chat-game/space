import {
  type IGameObjectFlag,
  type IGameVillageChunk,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { Flag, Stone, Tree, VillageCourier, VillageFarmer } from "../objects";
import { Campfire } from "../objects/buildings/campfire";
import { WagonStop } from "../objects/buildings/wagonStop";
import { Warehouse } from "../objects/buildings/warehouse";
import { GameChunk } from "./gameChunk";

interface IVillageOptions {
  center: IGameVillageChunk["center"];
  width: number;
  height: number;
}

export class Village extends GameChunk implements IGameVillageChunk {
  constructor({ width, height, center }: IVillageOptions) {
    super({ title: "", type: "VILLAGE", width, height, center });

    this.title = this.getRandomTitle();

    this.initFlags("RESOURCE", 40);
    this.initFlags("MOVEMENT", 30);
    this.initTrees(20);
    this.initStones(5);

    this.initCourier();
    this.initFarmer();
    this.initBuildings();
  }

  live() {
    super.live();

    for (const obj of this.objects) {
      void obj.live();
    }
  }

  initFlag(type: IGameObjectFlag["type"]) {
    const randomPoint = this.getRandomPoint();
    this.objects.push(new Flag({ type, x: randomPoint.x, y: randomPoint.y }));
  }

  initFlags(type: IGameObjectFlag["type"], count: number) {
    for (let i = 0; i < count; i++) {
      this.initFlag(type);
    }
  }

  initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.getRandomEmptyResourceFlagInVillage();
      if (flag) {
        const size = getRandomInRange(75, 90);
        const tree = new Tree({
          x: flag.x,
          y: flag.y,
          size,
          resource: 1,
          health: 20,
        });
        flag.target = tree;
        this.objects.push(tree);
      }
    }
  }

  initStones(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.getRandomEmptyResourceFlagInVillage();
      if (flag) {
        const stone = new Stone({ x: flag.x, y: flag.y, resource: 1 });
        flag.target = stone;
        this.objects.push(stone);
      }
    }
  }

  initCourier() {
    const randomPoint = this.getRandomPoint();
    this.objects.push(
      new VillageCourier({
        village: this,
        x: randomPoint.x,
        y: randomPoint.y,
      }),
    );
  }

  initFarmer() {
    const randomPoint = this.getRandomPoint();
    this.objects.push(
      new VillageFarmer({
        village: this,
        x: randomPoint.x,
        y: randomPoint.y,
      }),
    );
  }

  initBuildings() {
    this.objects.push(
      new Campfire({
        x: this.center.x,
        y: this.center.y,
      }),
    );
    this.objects.push(
      new Warehouse({
        x: this.center.x + 300,
        y: this.center.y - 120,
      }),
    );
    this.objects.push(
      new WagonStop({
        x: this.center.x - 480,
        y: this.center.y + 220,
      }),
    );
  }

  public getWagonStopPoint() {
    for (const object of this.objects) {
      if (object instanceof WagonStop) {
        return { x: object.x, y: object.y };
      }
    }
    return { x: 500, y: 500 };
  }

  getRandomEmptyResourceFlagInVillage() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === "RESOURCE" && !f.target,
    );
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined;
  }

  getRandomMovementFlagInVillage() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === "MOVEMENT",
    );
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined;
  }

  getRandomTitle() {
    const titles = [
      "Ветреный Пик",
      "Зеленая Роща",
      "Дубовый Берег",
      "Лесная Гавань",
      "Эльфийский Лес",
      "Каменная Застава",
      "Арбузный Рай",
      "Магическая Долина",
      "Королевское Пристанище",
      "Призрачный Утес",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  checkIfNeedToPlantTree() {
    const treesNow = this.objects.filter(
      (t) => t instanceof Tree && t.state !== "DESTROYED",
    );
    if (treesNow.length < 40) {
      return this.getRandomEmptyResourceFlagInVillage();
    }
  }

  plantNewTree(flag: Flag, tree: Tree) {
    flag.target = tree;
    this.objects.push(tree);
  }
}
