import { BaseObject } from '../baseObject'
import type {
  Game,
  GameObjectBuildingType,
  IGameObjectBuilding,
} from '$lib/game/types'
import { Inventory } from '$lib/game/common/inventory'

interface IBuildingOptions {
  game: Game
  x: number
  y: number
  type: GameObjectBuildingType
  chunkId?: string
}

export class BaseBuilding extends BaseObject implements IGameObjectBuilding {
  inventory!: Inventory

  constructor({ game, x, y, type, chunkId }: IBuildingOptions) {
    super({ game, x, y, type })

    this.chunkId = chunkId

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
    this.inventory = new Inventory({ object: this })
  }
}
