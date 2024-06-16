import { Sprite } from 'pixi.js'
import { BaseBuilding } from './baseBuilding'
import type { GameScene, IGameBuildingConstructionArea } from '$lib/game/types'

interface IConstructionAreaOptions {
  scene: GameScene
  x: number
  y: number
}

export class ConstructionArea
  extends BaseBuilding
  implements IGameBuildingConstructionArea {
  constructor({ scene, x, y }: IConstructionAreaOptions) {
    super({ scene, x, y, type: 'CONSTRUCTION_AREA' })

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
