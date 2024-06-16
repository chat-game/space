import { Sprite } from 'pixi.js'
import { BaseBuilding } from './baseBuilding'
import type { GameScene, IGameBuildingWagonStop } from '$lib/game/types'

interface IWagonStopOptions {
  scene: GameScene
  x: number
  y: number
}

export class WagonStop extends BaseBuilding implements IGameBuildingWagonStop {
  constructor({ scene, x, y }: IWagonStopOptions) {
    super({ scene, x, y, type: 'WAGON_STOP' })

    this.#initGraphics()
  }

  #initGraphics() {
    const sprite = Sprite.from('wagonStop1')
    if (sprite) {
      sprite.anchor.set(0.5, 0.92)
      this.addChild(sprite)
    }
  }

  animate() {
    super.animate()

    this.zIndex = Math.round(this.y - 100)
  }
}
