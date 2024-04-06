import { createId } from "@paralleldrive/cuid2";
import { getRandomInRange } from "../../../../../packages/api-sdk/src/lib/random";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./game-object";

export class Wolf extends GameObject {
  public readonly entity = "WOLF";

  constructor() {
    const id = createId();
    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super(id, x, y);

    console.log("Creating new wolf!");
  }

  live() {
    if (this.state === "IDLE") {
      const random = getRandomInRange(1, 50);
      if (random <= 1) {
        this.getRandomCoordinates(300);
        this.state = "MOVING";
      }

      this.sendMessage();
      return;
    }

    if (this.state === "MOVING") {
      this.move(0.5);

      this.sendMessage();
      return;
    }
  }
}
