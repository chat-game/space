import { Sprite } from 'pixi.js'
import { BaseBuilding } from './baseBuilding'
import type { Game, IGameBuildingWagonStop } from '$lib/game/types'

interface IWagonStopOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class WagonStop extends BaseBuilding implements IGameBuildingWagonStop {
  constructor({ game, x, y, chunkId }: IWagonStopOptions) {
    super({ game, x, y, chunkId, type: 'WAGON_STOP' })

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
