import { createId } from "@paralleldrive/cuid2";
import type {
  IGameInventory,
  InventoryItem,
  ItemType,
} from "../../../../../packages/api-sdk/src";
import { db } from "../../db/db.client";

interface IInventoryOptions {
  objectId: string;
  id: string;
}

export class Inventory implements IGameInventory {
  public id: string;
  public objectId: string;
  public items: InventoryItem[] = [];

  constructor({ id, objectId }: IInventoryOptions) {
    this.id = id;
    this.objectId = objectId;
  }

  public async init() {
    await this.readFromDB();
  }

  async addOrCreateItem(type: ItemType, amount: number) {
    const item = await this.checkIfAlreadyHaveItemInDB(this.id, type);
    if (!item) {
      await this.createItemInDB(this.id, type, amount);
      await this.readFromDB();
      return;
    }

    await this.incrementAmountOfItemInDB(item.id, amount);
    await this.readFromDB();
  }

  async destroyItemInDB(id: string) {
    await db.inventoryItem.delete({
      where: { id },
    });
    await this.readFromDB();
  }

  tryGetItem(type: ItemType) {
    return this.checkIfAlreadyHaveItemInDB(this.id, type);
  }

  async checkAndBreakItem(item: InventoryItem, decrement: number) {
    if (item.durability <= decrement) {
      await this.destroyItemInDB(item.id);
      await this.readFromDB();
      return;
    }

    item.durability -= decrement;
    await db.inventoryItem.update({
      where: { id: item.id },
      data: {
        durability: { decrement },
      },
    });
  }

  createItemInDB(inventoryId: string, type: ItemType, amount: number) {
    return db.inventoryItem.create({
      data: {
        id: createId(),
        type,
        inventoryId,
        amount,
      },
    });
  }

  incrementAmountOfItemInDB(id: string, amount: number) {
    return db.inventoryItem.update({
      where: { id },
      data: {
        amount: {
          increment: amount,
        },
      },
    });
  }

  checkIfAlreadyHaveItemInDB(inventoryId: string, type: ItemType) {
    return db.inventoryItem.findFirst({
      where: { inventoryId, type },
    });
  }

  async readFromDB() {
    const items = await db.inventoryItem.findMany({
      where: { inventoryId: this.id },
    });
    this.items = items as InventoryItem[];
  }

  public static async createInDB(objectId: string) {
    return db.inventory.create({
      data: {
        id: createId(),
        objectId,
      },
    });
  }
}
