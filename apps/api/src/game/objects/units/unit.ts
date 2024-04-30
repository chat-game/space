import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObject,
  type IGameObjectUnit,
  getRandomInRange,
} from "../../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../../config";
import { Inventory } from "../../common";
import { GameObject } from "../gameObject";

interface IUnitOptions {
  entity: IGameObject["entity"];
  id?: string;
  x?: number;
  y?: number;
  visual?: IGameObjectUnit["visual"];
}

export class Unit extends GameObject implements IGameObjectUnit {
  public inventory!: Inventory;
  public visual!: IGameObjectUnit["visual"];
  public coins: number;

  constructor({ entity, id, x, y, visual }: IUnitOptions) {
    const objectId = id ?? createId();

    const finalX = x ?? getRandomInRange(MIN_X, MAX_X);
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y);

    super({ id: objectId, x: finalX, y: finalY, entity });

    this.initInventory();
    this.initVisual(visual);
    this.coins = 0;
  }

  public initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    });
  }

  public initVisual(visual: IGameObjectUnit["visual"] | undefined) {
    this.visual = visual ?? {
      head: "1",
      hairstyle: "CLASSIC",
      top: "VIOLET_SHIRT",
    };
  }
}
