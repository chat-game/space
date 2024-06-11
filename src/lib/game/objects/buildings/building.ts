import type { IGameObjectBuilding, ItemType } from "$lib/game/types"
import { createId } from "@paralleldrive/cuid2"
import { Inventory } from "../../common"
import type { GameScene } from "../../scenes/gameScene"
import { GameObject } from "../gameObject"

interface IBuildingOptions {
  scene: GameScene
  x: number
  y: number
}

export class Building extends GameObject implements IGameObjectBuilding {
  public inventory!: Inventory

  constructor({ scene, x, y }: IBuildingOptions) {
    super({ scene, x, y })

    this.state = "IDLE"
    this.initInventory()
  }

  public animate() {
    super.animate()

    this.zIndex = Math.round(this.y - 5)

    if (this.state === "DESTROYED") {
      this.visible = false
    }
  }

  private initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    })
  }

  public getItemByType(type: ItemType) {
    if (!this.inventory?.items) {
      return
    }

    return this.inventory.items.find((item) => item.type === type)
  }
}
