import { createId } from "@paralleldrive/cuid2";
import { getRandomInRange } from "../../../../../packages/api-sdk/src/lib/random";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./game-object";

export class Flag extends GameObject {
  public readonly entity = "FLAG";

  constructor() {
    const id = createId();
    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super(id, x, y);

    console.log("Creating new flag!");
  }

  public setRandomCoordinates() {
    const { x, y } = this.getRandomCoordinates(300);
    this.x = x;
    this.y = y;
  }
}
