import {
  type IGameForestChunk,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { Tree } from "../objects";
import { GameChunk } from "./gameChunk";

interface IForestOptions {
  center: IGameForestChunk["center"];
}

export class Forest extends GameChunk implements IGameForestChunk {
  constructor({ center }: IForestOptions) {
    super({ center, title: "Лес", type: "FOREST", width: 3000, height: 1600 });

    this.initTrees(200);
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
      const tree = new Tree({ x: point.x, y: point.y, size, resource: 1 });
      this.objects.push(tree);
    }
  }
}
