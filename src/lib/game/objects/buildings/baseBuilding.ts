import { createId } from '@paralleldrive/cuid2'
import { Inventory } from '../../common'
import { BaseObject } from '../baseObject'
import type {
  GameObjectBuildingType,
  GameScene,
  IGameObjectBuilding,
  ItemType,
} from '$lib/game/types'

interface IBuildingOptions {
  scene: GameScene
  x: number
  y: number
  type: GameObjectBuildingType
}

export class BaseBuilding extends BaseObject implements IGameObjectBuilding {
  public inventory!: Inventory

  constructor({ scene, x, y, type }: IBuildingOptions) {
    super({ scene, x, y, type })

    this.#initInventory()
  }

  animate() {
    super.animate()

    this.zIndex = Math.round(this.y - 5)

    if (this.state === 'DESTROYED') {
      this.visible = false
    }
  }

  #initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    })
  }

  getItemByType(type: ItemType) {
    if (!this.inventory?.items) {
      return
    }

    return this.inventory.items.find((item) => item.type === type)
  }
}
