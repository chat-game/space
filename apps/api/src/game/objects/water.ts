import { GameObject } from "./gameObject";
import { IGameObjectWater } from "../../../../../packages/api-sdk/src";
import { createId } from "@paralleldrive/cuid2";

interface IWaterOptions {
  x: number;
  y: number;
}

export class Water extends GameObject implements IGameObjectWater {
  constructor({ x, y }: IWaterOptions) {
    const id = createId();

    super({ id, x, y, entity: "WATER" });
  }
}