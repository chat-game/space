import { createId } from "@paralleldrive/cuid2";
import type { IGameObjectBuilding } from "../../../../../packages/api-sdk/src";
import { Inventory } from "../common";
import { GameObject } from "./gameObject";

interface IBuildingOptions {
  type: IGameObjectBuilding["type"];
  x: number;
  y: number;
}

export class Building extends GameObject implements IGameObjectBuilding {
  public type: IGameObjectBuilding["type"];
  public inventory!: Inventory;

  constructor({ type, x, y }: IBuildingOptions) {
    const finalId = createId();

    super({ id: finalId, x, y, entity: "BUILDING" });

    this.type = type;
    this.initInventory();
  }

  live() {
    this.handleChange();
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  public initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    });
  }
}
