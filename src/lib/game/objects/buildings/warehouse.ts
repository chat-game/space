import { Sprite } from 'pixi.js'
import { BuildingInterface } from '../../components/buildingInterface'
import type { GameScene } from '../../scenes/gameScene.ts'
import { Building } from './building'
import type { IGameBuildingWarehouse } from '$lib/game/types'

interface IWarehouseOptions {
  scene: GameScene
  x: number
  y: number
}

export class Warehouse extends Building implements IGameBuildingWarehouse {
  public interface!: BuildingInterface

  constructor({ scene, x, y }: IWarehouseOptions) {
    super({ scene, x, y })

    this.initGraphics()
    // this.initInterface()
  }

  private initGraphics() {
    const sprite = Sprite.from('warehouse1')
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  private initInterface() {
    this.interface = new BuildingInterface(this)
    this.addChild(this.interface)
  }

  animate() {
    super.animate()

    // this.interface.animate()
  }
}
