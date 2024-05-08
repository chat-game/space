import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectRaider,
  getRandomInRange,
} from "../../../../../../packages/api-sdk/src";
import {
  RAIDER_CAMP_MAX_X,
  RAIDER_CAMP_MAX_Y,
  RAIDER_CAMP_MIN_X,
  RAIDER_CAMP_MIN_Y,
} from "../../../config";
import type { GameObject } from "../gameObject";
import { Unit } from "./unit";

export class Raider extends Unit implements IGameObjectRaider {
  public userName = "рейдер";
  public colorIndex = 0;

  constructor() {
    const objectId = createId();

    const finalX = getRandomInRange(RAIDER_CAMP_MIN_X, RAIDER_CAMP_MAX_X);
    const finalY = getRandomInRange(RAIDER_CAMP_MIN_Y, RAIDER_CAMP_MAX_Y);

    super({
      id: objectId,
      x: finalX,
      y: finalY,
      entity: "RAIDER",
      visual: {
        head: "1",
        hairstyle: "BOLD",
        top: "BLACK_SHIRT",
      },
    });
  }

  live() {
    if (this.state === "IDLE") {
      this.sendMessageObjectUpdated();
      return;
    }

    if (this.state === "MOVING") {
      this.sendMessageObjectUpdated();
      return;
    }
  }

  moveOutOfScene(target: GameObject) {
    this.target = target;
    this.state = "MOVING";
  }
}
