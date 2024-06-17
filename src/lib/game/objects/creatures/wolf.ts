import { Sprite } from 'pixi.js'
import { BaseObject } from '../baseObject'
import type { Game, IGameObjectWolf } from '$lib/game/types'

interface IWolfOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Wolf extends BaseObject implements IGameObjectWolf {
  #animationSlowSpeed = 0.1

  constructor({ game, x, y, chunkId }: IWolfOptions) {
    super({ game, x, y, type: 'WOLF' })

    this.chunkId = chunkId

    this.init()
  }

  init() {
    const spriteRight = Sprite.from('wolfRight')
    const spriteLeft = Sprite.from('wolfLeft')

    spriteRight.anchor.set(0.5, 1)
    spriteLeft.anchor.set(0.5, 1)

    spriteRight.direction = 'RIGHT'
    spriteLeft.direction = 'LEFT'

    this.addChild(spriteRight, spriteLeft)
  }

  animate() {
    // Hide all
    for (const t of this.children) {
      t.visible = false
    }

    // Visible only 1
    const sprite = this.children.find((t) => t.direction === this.direction)
    if (sprite) {
      sprite.visible = true
    }

    if (this.state === 'MOVING') {
      this.#shakeAnimation()
    }
  }

  #shakeAnimation() {
    if (Math.abs(this.angle) >= 2) {
      this.#animationSlowSpeed *= -1
    }
    this.angle += this.#animationSlowSpeed
  }
}
