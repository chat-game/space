import {
  type IGameForestChunk,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { Tree } from "../objects";
import { GameChunk } from "./gameChunk";

interface IForestOptions {
  center: IGameForestChunk["center"];
  width: number;
  height: number;
}

export class Forest extends GameChunk implements IGameForestChunk {
  constructor({ width, height, center }: IForestOptions) {
    super({
      title: "Роскошный Лес",
      type: "FOREST",
      width,
      height,
      center,
    });

    const treesToPrepare = Math.round((this.area.endX - this.area.startX) / 10);
    console.log(`preparing ${treesToPrepare} trees`);
    this.initTrees(treesToPrepare);
  }

  live() {
    super.live();

    for (const obj of this.objects) {
      void obj.live();
    }
  }

  initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.getRandomPoint();
      const size = getRandomInRange(75, 90);
      const tree = new Tree({
        x: point.x,
        y: point.y,
        size,
        resource: 1,
        health: 20,
      });
      this.objects.push(tree);
    }
  }
}
