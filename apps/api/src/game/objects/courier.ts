import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectCourier,
  type ItemType,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { Unit } from "./unit";

interface ICourierOptions {
  id?: string;
}

export class Courier extends Unit implements IGameObjectCourier {
  constructor({ id }: ICourierOptions) {
    const objectId = id ?? createId();

    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super({ id: objectId, x, y, entity: "COURIER" });
  }

  live() {
    if (this.state === "IDLE") {
      this.handleChange();
      return;
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  async takeItemFromUnit(type: ItemType) {
    if (this.target instanceof Unit) {
      const item = this.target.inventory.transferItemWithType(type);
      if (item) {
        await this.inventory.addOrCreateItem(item.type, item.amount);
        this.target.inventory.destroyItem(item.id);

        return true;
      }
    }

    return false;
  }
}
