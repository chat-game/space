import { createId } from "@paralleldrive/cuid2";
import type {
  GameObjectTree,
  GameObjectTreeType,
} from "../../../../../packages/api-sdk/src";
import { getRandomInRange } from "../../../../../packages/api-sdk/src/lib/random";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { db } from "../../db/db.client";
import { GameObject } from "./game-object";

export class Tree extends GameObject implements GameObjectTree {
  public readonly entity = "TREE";
  public type: GameObjectTree["type"] = "1";
  public resource = 0;
  public size = 100;
  public health = 100;
  public isReadyToChop = false;
  public isReserved = false;

  constructor(id?: string) {
    const objectId = id ?? createId();

    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super(objectId, x, y);

    this.state = "IDLE";
    this.resource = getRandomInRange(1, 5);
    this.type = this.getNewTreeType();

    console.log(`Created tree ${objectId}!`);
  }

  live() {
    if (this.state === "IDLE") {
      // this.grow();
      this.sendMessage();
      return;
    }

    if (this.state === "CHOPPING") {
      if (this.health <= 0) {
        this.setAsChopped();
      }

      const random = getRandomInRange(1, 20);
      if (random <= 1 && this.health > 0) {
        this.state = "IDLE";
        this.isReserved = false;
      }

      this.sendMessage();
      return;
    }

    if (this.state === "DESTROYED") {
      this.sendMessage();
      return;
    }
  }

  grow() {
    if (this.size >= 75 && !this.isReadyToChop) {
      this.isReadyToChop = true;
    }
    if (this.size >= 100) {
      return;
    }

    this.size += 0.01;
  }

  public chop() {
    this.state = "CHOPPING";
    this.isReserved = true;
    this.health -= 0.08;
  }

  setAsChopped() {
    this.size = 0;
    this.health = 0;
    this.state = "DESTROYED";
  }

  getNewTreeType(): GameObjectTreeType {
    const types: GameObjectTreeType[] = ["1", "2", "3"];
    const index = getRandomInRange(0, types.length - 1);
    return types[index];
  }

  public async readFromDB() {
    const tree = await db.tree.findUnique({ where: { id: this.id } });
    if (!tree) {
      return;
    }

    this.x = tree.x;
    this.y = tree.y;
    this.type = tree.type as GameObjectTree["type"];
    this.size = tree.size;
    this.resource = tree.resource;
  }

  public async updateInDB() {
    await db.tree.update({
      where: { id: this.id },
      data: {
        x: this.x,
        y: this.y,
        size: this.size,
        type: this.type,
        resource: this.resource,
      },
    });
  }
}
