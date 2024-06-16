import { Sprite } from 'pixi.js'
import { BuildingInterface } from '../../components/buildingInterface'
import { BaseBuilding } from './baseBuilding'
import type { GameScene, IGameBuildingWarehouse } from '$lib/game/types'

interface IWarehouseOptions {
  scene: GameScene
  x: number
  y: number
}

export class Warehouse extends BaseBuilding implements IGameBuildingWarehouse {
  public interface!: BuildingInterface

  constructor({ scene, x, y }: IWarehouseOptions) {
    super({ scene, x, y, type: 'WAREHOUSE' })

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
