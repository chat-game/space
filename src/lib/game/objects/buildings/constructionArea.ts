import { Sprite } from 'pixi.js'
import { BaseBuilding } from './baseBuilding'
import type {
  Game,
  IGameBuildingConstructionArea,
} from '$lib/game/types'

interface IConstructionAreaOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class ConstructionArea
  extends BaseBuilding
  implements IGameBuildingConstructionArea {
  constructor({ game, x, y, chunkId }: IConstructionAreaOptions) {
    super({ game, x, y, chunkId, type: 'CONSTRUCTION_AREA' })

    this.#initGraphics()
  }

  #initGraphics() {
    const sprite = Sprite.from('constructionArea1')
    if (sprite) {
      sprite.anchor.set(0.5, 0.92)
      this.addChild(sprite)
    }
  }
}
