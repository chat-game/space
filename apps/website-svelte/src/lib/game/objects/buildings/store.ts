import { Sprite } from 'pixi.js'
import { BaseBuilding } from './baseBuilding'
import type { Game, IGameBuildingStore } from '$lib/game/types'

interface IStoreOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Store extends BaseBuilding implements IGameBuildingStore {
  constructor({ game, x, y, chunkId }: IStoreOptions) {
    super({ game, x, y, chunkId, type: 'STORE' })

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
