import { BaseObject } from './baseObject'
import { Water } from './water'
import type { Game, IGameObjectLake } from '$lib/game/types'
import { AssetsManager } from '$lib/game/utils/assetsManager'

interface ILakeOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Lake extends BaseObject implements IGameObjectLake {
  public water: Water[] = []

  constructor({ game, x, y, chunkId }: ILakeOptions) {
    super({ game, x, y, type: 'LAKE' })

    this.chunkId = chunkId

    this.#generate(13)
    this.#initGraphics()
  }

  animate() {
    super.animate()

    this.zIndex = 0
  }

  #generate(r: number) {
    for (let y = r; y >= -r; --y) {
      for (let x = -r; x <= r; x++) {
        const value = x ** 2 + y ** 2

        if (value < r ** 2) {
          this.#draw(x, y)
        }
      }
    }
  }

  #draw(x: number, y: number) {
    const water = new Water({ game: this.game, x: x * 32, y: y * 32 })
    this.water.push(water)
  }

  initWater(width: number, height: number) {
    const gridX = Math.ceil(width / 32)
    const gridY = Math.floor(height / 32)

    console.log(gridX, gridY)

    // const center = { x: Math.round(width / 2), y: Math.round(height / 2) }

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const x = i * 32
        const y = j * 32

        // if (x <= center.x && y <= center.y) {
        //   continue
        // }

        const water = new Water({ game: this.game, x, y })
        this.water.push(water)
      }
    }
  }

  #initGraphics() {
    for (const w of this.water) {
      const sprite = AssetsManager.getRandomSpriteForWater()
      sprite.anchor.set(0.5, 1)
      sprite.x = w.x
      sprite.y = w.y
      this.addChild(sprite)
    }
  }
}
