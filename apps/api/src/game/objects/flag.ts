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
  public readonly entity = "FLAG";
  public isOnScreen = true;

  constructor({ x, y, id, isOnScreen }: IFlagOptions) {
    const finalId = id ?? createId();
    const finalX = x ?? getRandomInRange(MIN_X, MAX_X);
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y);

    super({ id: finalId, x: finalX, y: finalY });

    this.isOnScreen = isOnScreen ?? true;
  }
}
