import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectCourier,
  type ItemType,
  getRandomInRange,
} from "../../../../../../packages/api-sdk/src"
import type { Village } from "../../chunks"
import { Building } from "../buildings/building"
import { Unit } from "./unit"

interface ICourierOptions {
  village: Village
  x: number
  y: number
}

export class VillageCourier extends Unit implements IGameObjectCourier {
  private village: Village

  constructor({ village, x, y }: ICourierOptions) {
    const id = createId()

    super({
      id,
      x,
      y,
      entity: "COURIER",
      visual: {
        head: "1",
        hairstyle: "BOLD",
        top: "BLUE_SHIRT",
      },
    })

    this.village = village
  }

  async live() {
    if (this.state === "IDLE") {
      // const playerWithWood = scene.findUnitWithItem("WOOD");
      // if (playerWithWood) {
      //   this.setTarget(playerWithWood);
      //   return;
      // }
      //
      // const playerWithStone = scene.findUnitWithItem("STONE");
      // if (playerWithStone) {
      //   this.setTarget(playerWithStone);
      //   return;
      // }

      const random = getRandomInRange(1, 100)
      if (random <= 1) {
        const randObj = this.village.getRandomMovementFlagInVillage()
        if (!randObj) {
          return
        }
        this.setTarget(randObj)
      }

      this.handleChange()
      return
    }

    if (this.state === "MOVING") {
      const isMoving = this.move(2, 12)
      this.handleChange()

      if (!isMoving && this.target) {
        // if (this.target instanceof Player) {
        //   await this.takeItemFromUnit("WOOD");
        //   await this.takeItemFromUnit("STONE");
        //
        //   const warehouse = scene.findBuildingByType("WAREHOUSE");
        //   if (warehouse) {
        //     return this.setTarget(warehouse);
        //   }
        // }
        //
        // if (this.target instanceof Building) {
        //   await this.placeItemInBuilding("WOOD");
        //   await this.placeItemInBuilding("STONE");
        // }
      }

      return
    }
  }

  handleChange() {
    const prepared = {
      ...this,
      village: undefined,
    }

    this.sendMessageObjectUpdated(prepared)
  }

  async takeItemFromUnit(type: ItemType) {
    if (this.target instanceof Unit) {
      const item = this.target.inventory.transferItemWithType(type)
      if (item) {
        await this.inventory.addOrCreateItem(item.type, item.amount)
        this.target.inventory.destroyItem(item.id)

        return true
      }
    }

    return false
  }

  async placeItemInBuilding(type: ItemType) {
    if (this.target instanceof Building) {
      const item = this.inventory.transferItemWithType(type)
      if (item) {
        await this.target.inventory.addOrCreateItem(item.type, item.amount)
        this.inventory.destroyItem(item.id)

        return true
      }
    }

    return false
  }
}
