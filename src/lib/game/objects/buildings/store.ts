import { Sprite } from 'pixi.js'
import { BaseBuilding } from './baseBuilding'
import type { GameScene, IGameBuildingStore } from '$lib/game/types'

interface IStoreOptions {
  scene: GameScene
  x: number
  y: number
}

export class Store extends BaseBuilding implements IGameBuildingStore {
  constructor({ scene, x, y }: IStoreOptions) {
    super({ scene, x, y, type: 'STORE' })

    this.#initGraphics()
  }

  #initGraphics() {
    const sprite = Sprite.from('store1')
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }
}
