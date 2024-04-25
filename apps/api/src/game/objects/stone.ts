import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectStone,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./gameObject";

interface IStoneOptions {
  id?: string;
  x?: number;
  y?: number;
  resource?: number;
  size?: number;
  health?: number;
}

export class Stone extends GameObject implements IGameObjectStone {
  public type: IGameObjectStone["type"] = "1";
  public resource = 0;
  public size = 100;
  public health = 100;
  public isReserved = false;

  constructor({ id, x, y, resource }: IStoneOptions) {
    const objectId = id ?? createId();

    const finalX = x ?? getRandomInRange(MIN_X, MAX_X);
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y);

    super({ id: objectId, x: finalX, y: finalY, entity: "STONE" });

    this.state = "IDLE";
    this.resource = resource ?? getRandomInRange(1, 5);
  }

  live() {
    if (this.state === "IDLE") {
      const random = getRandomInRange(1, 60);
      if (random <= 1) {
        this.handleChange();
      }
      return;
    }

    if (this.state === "MINING") {
      if (this.health <= 0) {
        this.setAsMined();
      }

      const random = getRandomInRange(1, 20);
      if (random <= 1 && this.health > 0) {
        this.state = "IDLE";
        this.isReserved = false;
        this.handleChange();
      }

      return;
    }

    if (this.state === "DESTROYED") {
      return;
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  mine() {
    this.state = "MINING";
    this.isReserved = true;
    this.health -= 0.08;
    this.handleChange();
  }

  setAsMined() {
    this.size = 0;
    this.health = 0;
    this.state = "DESTROYED";
    this.handleChange();
  }
}
