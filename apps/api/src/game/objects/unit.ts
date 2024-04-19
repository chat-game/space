import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObject,
  type IGameObjectUnit,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { Inventory } from "../common";
import { GameObject } from "./gameObject";

interface IUnitOptions {
  entity: IGameObject["entity"];
  id?: string;
  x?: number;
  y?: number;
}

export class Unit extends GameObject implements IGameObjectUnit {
  public inventory!: Inventory;

  constructor({ entity, id, x, y }: IUnitOptions) {
    const objectId = id ?? createId();

    const finalX = x ?? getRandomInRange(MIN_X, MAX_X);
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y);

    super({ id: objectId, x: finalX, y: finalY, entity });

    void this.initInventory();
  }

  public async initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    });
  }
}
