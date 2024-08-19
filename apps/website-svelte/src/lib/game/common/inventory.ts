import { createId } from '@paralleldrive/cuid2'
import type {
  GameObject,
  IGameInventory,
  IGameInventoryItem,
  ItemType,
} from '$lib/game/types'

interface InventoryOptions {
  object: GameObject
  saveInDb?: boolean
}

export class Inventory implements IGameInventory {
  id: string
  object: GameObject
  items: IGameInventoryItem[] = []
  saveInDb: boolean

  constructor({ object, saveInDb }: InventoryOptions) {
    this.id = createId()
    this.object = object
    this.saveInDb = saveInDb ?? false
  }

  public async init(inventoryId?: string) {
    if (inventoryId) {
      this.id = inventoryId
      await this.#readFromDB()
    }
  }

  public async destroyItem(id: string) {
    const itemIndex = this.items.findIndex((i) => i.id === id)
    if (itemIndex < 0) {
      return
    }

    this.items.splice(itemIndex, 1)

    if (this.saveInDb) {
      await this.destroyItemInDB(id)
    }
  }

  async reduceOrDestroyItem(type: ItemType, amount: number): Promise<boolean> {
    const item = this.checkIfAlreadyHaveItem(type)
    if (!item) {
      return false
    }

    if (amount > item.amount) {
      return false
    }

    if (amount === item.amount) {
      await this.destroyItem(item.id)
      return true
    }

    if (this.saveInDb) {
      await this.decrementAmountOfItemInDB(item.id, amount)
    }

    item.amount -= amount
    return true
  }

  async addOrCreateItem(type: ItemType, amount: number): Promise<void> {
    if (this.saveInDb) {
      return this.addOrCreateItemInDB(type, amount)
    }

    const item = this.checkIfAlreadyHaveItem(type)
    if (!item) {
      this.createItem(type, amount)
      return
    }

    item.amount += amount
  }

  async addOrCreateItemInDB(type: ItemType, amount: number) {
    // const item = await this.checkIfAlreadyHaveItemInDB(this.id, type)
    const item = { id: '123' }
    if (!item) {
      await this.createItemInDB(this.id, type, amount)
      await this.#readFromDB()
      return
    }

    await this.incrementAmountOfItemInDB(item.id, amount)
    await this.#readFromDB()
  }

  async destroyItemInDB(_id: string) {
    // await db.inventoryItem.delete({
    //   where: { id },
    // })
    await this.#readFromDB()
  }

  public tryGetItemInDB(type: ItemType) {
    return this.checkIfAlreadyHaveItemInDB(this.id, type)
  }

  async checkAndBreakItem(item: IGameInventoryItem, decrement: number) {
    if (item.durability <= decrement) {
      await this.destroyItemInDB(item.id)
      await this.#readFromDB()
      return
    }

    item.durability -= decrement
    // await db.inventoryItem.update({
    //   where: { id: item.id },
    //   data: {
    //     durability: { decrement },
    //   },
    // })
  }

  createItemInDB(_inventoryId: string, _type: ItemType, _amount: number) {
    // return db.inventoryItem.create({
    //   data: {
    //     id: createId(),
    //     type,
    //     inventoryId,
    //     amount,
    //   },
    // })
  }

  incrementAmountOfItemInDB(_id: string, _amount: number) {
    // return db.inventoryItem.update({
    //   where: { id },
    //   data: {
    //     amount: {
    //       increment: amount,
    //     },
    //   },
    // })
  }

  decrementAmountOfItemInDB(_id: string, _amount: number) {
    // return db.inventoryItem.update({
    //   where: { id },
    //   data: {
    //     amount: {
    //       decrement: amount,
    //     },
    //   },
    // })
  }

  checkIfAlreadyHaveItemInDB(_inventoryId: string, _type: ItemType) {
    // return db.inventoryItem.findFirst({
    //   where: { inventoryId, type },
    // })
  }

  checkIfAlreadyHaveItem(type: ItemType): IGameInventoryItem | undefined {
    return this.items.find((item) => item.type === type)
  }

  createItem(type: ItemType, amount: number) {
    const item: IGameInventoryItem = {
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      type,
      amount,
      durability: 100,
      inventoryId: '',
    }
    this.items.push(item)
  }

  async #readFromDB() {
    const inventory = await this.object.game.serverService.getInventory(this.id)
    if (!inventory) {
      return
    }

    this.items = inventory.items
  }
}
