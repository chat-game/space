import { createId } from "@paralleldrive/cuid2";
import type { IGameObjectBuilding } from "../../../../../packages/api-sdk/src";
import { GameObject } from "./gameObject";

interface IBuildingOptions {
  type: IGameObjectBuilding["type"];
  x: number;
  y: number;
}

export class Building extends GameObject implements IGameObjectBuilding {
  public type: IGameObjectBuilding["type"];

  constructor({ type, x, y }: IBuildingOptions) {
    const finalId = createId();

    super({ id: finalId, x, y, entity: "BUILDING" });

    this.type = type;
  }

  live() {
    this.handleChange();
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }
}
