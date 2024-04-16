import { createId } from "@paralleldrive/cuid2";
import {
  type GameObjectTree,
  type GameObjectTreeType,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { db } from "../../db/db.client";
import { GameObject } from "./gameObject";

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
  }

  live() {
    switch (this.state) {
      case "IDLE":
        this.handleIdleState();
        break;
      case "CHOPPING":
        this.handleChoppingState();
        break;
      case "DESTROYED":
        break;
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  handleIdleState() {
    // this.grow();
    const random = getRandomInRange(1, 80);
    if (random <= 1) {
      this.handleChange();
    }
  }

  handleChoppingState() {
    if (this.health <= 0) {
      this.setAsChopped();
    }
    const random = getRandomInRange(1, 20);
    if (random <= 1 && this.health > 0) {
      this.state = "IDLE";
      this.isReserved = false;
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
    this.handleChange();
  }

  public chop() {
    this.state = "CHOPPING";
    this.isReserved = true;
    this.health -= 0.08;
    this.handleChange();
  }

  setAsChopped() {
    this.size = 0;
    this.health = 0;
    this.state = "DESTROYED";
    this.handleChange();
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
