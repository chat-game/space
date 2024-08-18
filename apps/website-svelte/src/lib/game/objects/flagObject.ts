import { Sprite } from 'pixi.js'
import { BaseObject } from './baseObject'
import type { Game, GameObjectFlag } from '$lib/game/types'

interface FlagOptions {
  game: Game
  x: number
  y: number
  variant: GameObjectFlag['variant']
  chunkId?: string
  offsetX?: number
  offsetY?: number
}

export class FlagObject extends BaseObject implements GameObjectFlag {
  variant: GameObjectFlag['variant']

  public isReserved: boolean
  public offsetX: number
  public offsetY: number

  constructor({ game, chunkId, x, y, variant, offsetX, offsetY }: FlagOptions) {
    super({ game, x, y, type: 'FLAG' })

    this.chunkId = chunkId
    this.variant = variant
    this.isReserved = false
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0

    this.visible = false

    this.#initGraphics()
  }

  live() {
    super.live()

    if (this.target?.state === 'DESTROYED') {
      this.target = undefined
    }
  }

  animate() {
    super.animate()

    if (this.game.checkIfThisFlagIsTarget(this.id)) {
      this.visible = true
      return
    }

    if (this.variant === 'WAGON_MOVEMENT') {
      this.visible = true
      return
    }

    if (this.state === 'DESTROYED') {
      this.visible = false
      return
    }

    this.visible = false
  }

  #initGraphics() {
    const sprite = this.#getSprite()
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  #getSprite() {
    if (
      this.variant === 'MOVEMENT'
      || this.variant === 'WAGON_NEAR_MOVEMENT'
      || this.variant === 'WAGON_MOVEMENT'
    ) {
      return Sprite.from('flag1')
    }
    if (this.variant === 'RESOURCE') {
      return Sprite.from('flag2')
    }
  }
}
