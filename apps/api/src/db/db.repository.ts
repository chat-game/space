import { createId } from "@paralleldrive/cuid2";
import { getRandomInRange } from "../../../../packages/api-sdk/src";
import { Inventory } from "../game/common";
import { db } from "./db.client";

export class DBRepository {
  private readonly db;

  constructor() {
    this.db = db;
  }

  findTrees() {
    return this.db.tree.findMany();
  }

  findStones() {
    return this.db.stone.findMany();
  }

  findActivePlayers() {
    const milliseconds = 20 * 60 * 1000;
    const gte = new Date(new Date().getTime() - milliseconds);

    return this.db.player.findMany({
      where: {
        lastActionAt: { gte },
      },
    });
  }

  findPlayerByTwitchId(twitchId: string) {
    return this.db.player.findFirst({
      where: { twitchId },
    });
  }

  createPlayer({
    twitchId,
    userName,
    inventoryId,
    id,
  }: { twitchId: string; userName: string; inventoryId: string; id: string }) {
    const colorIndex = getRandomInRange(0, 360);
    return db.player.create({
      data: {
        id,
        twitchId,
        userName,
        x: -100,
        y: 600,
        colorIndex,
        inventoryId,
      },
    });
  }

  async findOrCreatePlayer(twitchId: string, userName: string) {
    const player = await this.findPlayerByTwitchId(twitchId);
    if (!player) {
      const id = createId();
      const inventory = await this.createInventory(id);
      return this.createPlayer({
        id,
        twitchId,
        userName,
        inventoryId: inventory.id,
      });
    }

    return player;
  }

  createInventory(objectId: string) {
    return db.inventory.create({
      data: {
        id: createId(),
        objectId,
      },
    });
  }

  addPlayerViewerPoints(id: string, increment: number) {
    return db.player.update({
      where: { id },
      data: {
        viewerPoints: { increment },
      },
    });
  }
}
