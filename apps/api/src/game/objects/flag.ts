import { createId } from "@paralleldrive/cuid2";
import { getRandomInRange } from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./gameObject";

export class Flag extends GameObject {
  public readonly entity = "FLAG";
  public isOnScreen = true;

  constructor(x?: number, y?: number, id?: string, isOnScreen?: boolean) {
    const finalId = id ?? createId();
    const finalX = x ?? getRandomInRange(MIN_X, MAX_X);
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y);

    super(finalId, finalX, finalY);

    this.isOnScreen = isOnScreen ?? true;
  }
}
