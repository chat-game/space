import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectFarmer,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import type { Village } from "../chunks";
import { Flag } from "./flag";
import { Tree } from "./tree";
import { Unit } from "./units/unit";

interface IVillageFarmerOptions {
  village: Village;
  x: number;
  y: number;
}

export class VillageFarmer extends Unit implements IGameObjectFarmer {
  private village: Village;

  constructor({ village, x, y }: IVillageFarmerOptions) {
    const id = createId();

    super({
      id,
      x,
      y,
      entity: "FARMER",
      visual: {
        head: "1",
        hairstyle: "CLASSIC",
        top: "GREEN_SHIRT",
      },
    });

    this.village = village;
  }

  live() {
    if (this.state === "IDLE") {
      const flagToPlantNewTree = this.village.checkIfNeedToPlantTree();
      if (flagToPlantNewTree) {
        this.target = flagToPlantNewTree;
        this.state = "MOVING";

        this.handleChange();
        return;
      }

      const random = getRandomInRange(1, 300);
      if (random <= 1) {
        const randomObj = this.village.getRandomMovementFlagInVillage();
        if (!randomObj) {
          return;
        }
        this.setTarget(randomObj);
      }

      this.handleChange();
      return;
    }

    if (this.state === "MOVING") {
      const isMoving = this.move(1, 4);

      if (!isMoving && this.target) {
        if (this.target instanceof Flag && this.target.type === "RESOURCE") {
          const tree = new Tree({
            x: this.target.x,
            y: this.target.y,
            resource: 1,
            size: 12,
          });
          this.village.plantNewTree(this.target, tree);
        }

        this.state = "IDLE";
        this.target = undefined;
      }

      this.handleChange();
      return;
    }
  }

  handleChange() {
    const prepared = {
      ...this,
      village: undefined,
    };

    this.sendMessageObjectUpdated(prepared);
  }
}
