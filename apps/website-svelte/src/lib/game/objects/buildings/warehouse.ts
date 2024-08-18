import { Sprite } from 'pixi.js'
import { BuildingInterface } from '../../components/buildingInterface'
import { BaseBuilding } from './baseBuilding'
import type { Game, IGameBuildingWarehouse } from '$lib/game/types'

interface IWarehouseOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Warehouse extends BaseBuilding implements IGameBuildingWarehouse {
  public interface!: BuildingInterface

  constructor({ game, x, y, chunkId }: IWarehouseOptions) {
    super({ game, x, y, chunkId, type: 'WAREHOUSE' })

    this.#initGraphics()
    // this.#initInterface()
  }

  #initGraphics() {
    const sprite = Sprite.from('warehouse1')
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  #initInterface() {
    this.interface = new BuildingInterface(this)
    this.addChild(this.interface)
  }

  animate() {
    super.animate()

    // this.interface.animate()
  }
}
