import { Sprite } from 'pixi.js'
import { BaseObject } from './baseObject'
import type { GameObjectFlag, GameScene } from '$lib/game/types'

interface FlagOptions {
  scene: GameScene
  x: number
  y: number
  variant: GameObjectFlag['variant']
  offsetX?: number
  offsetY?: number
}

export class FlagObject extends BaseObject implements GameObjectFlag {
  variant: GameObjectFlag['variant']

  public isReserved: boolean
  public offsetX: number
  public offsetY: number

  constructor({ scene, x, y, variant, offsetX, offsetY }: FlagOptions) {
    super({ scene, x, y, type: 'FLAG' })

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
      this.removeTarget()
    }
  }

  animate() {
    if (this.scene.game.checkIfThisFlagIsTarget(this.id)) {
      this.visible = true
      return
    }

    if (this.type === 'WAGON_MOVEMENT') {
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
