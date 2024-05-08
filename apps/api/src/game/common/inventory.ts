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
  saveInDb: boolean;
}

export class Inventory implements IGameInventory {
  public id: string;
  public objectId: string;
  public items: InventoryItem[] = [];
  public saveInDb: boolean;

  constructor({ id, objectId, saveInDb }: IInventoryOptions) {
    this.id = id;
    this.objectId = objectId;
    this.saveInDb = saveInDb;
  }

  public async init() {
    await this.updateFromDB();
  }

  public transferItemWithType(type: ItemType) {
    return this.items.find((i) => i.type === type);
  }

  public destroyItem(id: string) {
    const itemIndex = this.items.findIndex((i) => i.id === id);
    if (itemIndex < 0) {
      return;
    }

    this.items.splice(itemIndex, 1);
  }

  public async reduceOrDestroyItem(type: ItemType, amount: number) {
    const item = this.checkIfAlreadyHaveItem(type);
    if (!item) {
      return false;
    }

    if (amount > item.amount) {
      return false;
    }

    if (amount === item.amount) {
      this.destroyItem(item.id);
      return true;
    }

    item.amount -= amount;
    return true;
  }

  public async addOrCreateItem(type: ItemType, amount: number) {
    if (this.saveInDb) {
      return this.addOrCreateItemInDB(type, amount);
    }

    const item = this.checkIfAlreadyHaveItem(type);
    if (!item) {
      this.createItem(type, amount);
      return;
    }

    item.amount += amount;
  }

  async addOrCreateItemInDB(type: ItemType, amount: number) {
    const item = await this.checkIfAlreadyHaveItemInDB(this.id, type);
    if (!item) {
      await this.createItemInDB(this.id, type, amount);
      await this.updateFromDB();
      return;
    }

    await this.incrementAmountOfItemInDB(item.id, amount);
    await this.updateFromDB();
  }

  async destroyItemInDB(id: string) {
    await db.inventoryItem.delete({
      where: { id },
    });
    await this.updateFromDB();
  }

  public tryGetItemInDB(type: ItemType) {
    return this.checkIfAlreadyHaveItemInDB(this.id, type);
  }

  async checkAndBreakItem(item: InventoryItem, decrement: number) {
    if (item.durability <= decrement) {
      await this.destroyItemInDB(item.id);
      await this.updateFromDB();
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

  checkIfAlreadyHaveItem(type: ItemType) {
    return this.items.find((item) => item.type === type);
  }

  createItem(type: ItemType, amount: number) {
    const item: InventoryItem = {
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      type,
      amount,
      durability: 100,
      inventoryId: "",
    };
    this.items.push(item);
  }

  async updateFromDB() {
    const items = await db.inventoryItem.findMany({
      where: { inventoryId: this.id },
    });
    this.items = items as InventoryItem[];
  }
}
