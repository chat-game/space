import { createId } from "@paralleldrive/cuid2";
import {
  type IGameChunk,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import type { GameObject } from "../objects";

interface IGameChunkOptions {
  center: IGameChunk["center"];
  title: IGameChunk["title"];
  type: IGameChunk["type"];
  width: number;
  height: number;
}

export class GameChunk implements IGameChunk {
  public id: string;
  public title: string;
  public type: IGameChunk["type"];
  public center: IGameChunk["center"];
  public area!: IGameChunk["area"];
  public isVisibleOnClient = false;
  public objects: GameObject[] = [];

  constructor({ center, title, type, width, height }: IGameChunkOptions) {
    this.id = createId();
    this.center = center;
    this.title = title;
    this.type = type;

    this.initArea(width, height);
  }

  private initArea(width: number, height: number) {
    const halfWidth = Math.round(width / 2);
    const halfHeight = Math.round(height / 2);

    this.area = {
      startX: this.center.x - halfWidth,
      endX: this.center.x + halfWidth,
      startY: this.center.y - halfHeight,
      endY: this.center.y + halfHeight,
    };
  }

  public live() {
    for (const obj of this.objects) {
      obj.isVisibleOnClient = this.isVisibleOnClient;
    }
  }

  public getRandomPoint() {
    return {
      x: getRandomInRange(this.area.startX, this.area.endX),
      y: getRandomInRange(this.area.startY, this.area.endY),
    };
  }

  public checkIfPointIsInArea(point: { x: number; y: number }): boolean {
    if (point.x >= this.area.startX && point.x <= this.area.endX) {
      if (point.y >= this.area.startY && point.y <= this.area.endY) {
        return true;
      }
    }

    return false;
  }
}
