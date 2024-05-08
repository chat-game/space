import { createId } from "@paralleldrive/cuid2"
import type {
  IGameObjectBuilding,
  IGameObjectBuildingType,
} from "../../../../../../packages/api-sdk/src"
import { Inventory } from "../../common"
import { GameObject } from "../gameObject"

interface IBuildingOptions {
  entity: IGameObjectBuildingType
  x: number
  y: number
}

export class Building extends GameObject implements IGameObjectBuilding {
  public inventory!: Inventory

  constructor({ entity, x, y }: IBuildingOptions) {
    const finalId = createId()

    super({ id: finalId, x, y, entity })

    this.initInventory()
  }

  live() {
    this.handleChange()
  }

  handleChange() {
    this.sendMessageObjectUpdated()
  }

  public initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    })
  }
}
