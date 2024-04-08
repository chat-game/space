import { createId } from "@paralleldrive/cuid2";
import type { GameObjectStone } from "../../../../../packages/api-sdk/src";
import { getRandomInRange } from "../../../../../packages/api-sdk/src/lib/random";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { db } from "../../db/db.client";
import { GameObject } from "./game-object";

export class Stone extends GameObject implements GameObjectStone {
  public readonly entity = "STONE";
  public type: GameObjectStone["type"] = "1";
  public resource = 0;
  public size = 100;
  public health = 100;
  public isReserved = false;

  constructor(id?: string) {
    const objectId = id ?? createId();

    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super(objectId, x, y);

    this.state = "IDLE";
    this.resource = getRandomInRange(1, 5);

    console.log(`Created stone ${objectId}!`);
  }

  live() {
    if (this.state === "IDLE") {
      this.sendMessage();
      return;
    }

    if (this.state === "MINING") {
      if (this.health <= 0) {
        this.setAsMined();
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

  mine() {
    this.state = "MINING";
    this.isReserved = true;
    this.health -= 0.08;
  }

  setAsMined() {
    this.size = 0;
    this.health = 0;
    this.state = "DESTROYED";
  }

  public async readFromDB() {
    const stone = await db.stone.findUnique({ where: { id: this.id } });
    if (!stone) {
      return;
    }

    this.x = stone.x;
    this.y = stone.y;
    this.type = stone.type as GameObjectStone["type"];
    this.size = stone.size;
    this.resource = stone.resource;
  }

  public async updateInDB() {
    await db.stone.update({
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
