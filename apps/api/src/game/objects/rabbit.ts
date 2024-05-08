import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectRabbit,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./gameObject";

export class Rabbit extends GameObject implements IGameObjectRabbit {
  constructor() {
    const id = createId();
    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super({ id, x, y, entity: "RABBIT" });
  }

  live() {
    if (this.state === "IDLE") {
      return;
    }

    if (this.state === "MOVING") {
      const isMoving = this.move(1);
      this.handleChange();

      if (!isMoving) {
        this.state = "IDLE";
        return;
      }

      return;
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }
}
