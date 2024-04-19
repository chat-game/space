import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectFlag,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./gameObject";

interface IFlagOptions {
  x?: number;
  y?: number;
  id?: string;
  isOnScreen?: boolean;
}

export class Flag extends GameObject implements IGameObjectFlag {
  public isOnScreen = true;

  constructor({ x, y, id, isOnScreen }: IFlagOptions) {
    const finalId = id ?? createId();
    const finalX = x ?? getRandomInRange(MIN_X, MAX_X);
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y);

    super({ id: finalId, x: finalX, y: finalY, entity: "FLAG" });

    this.isOnScreen = isOnScreen ?? true;
  }

  live() {
    const random = getRandomInRange(1, 60);
    if (random <= 1) {
      this.handleChange();
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }
}
