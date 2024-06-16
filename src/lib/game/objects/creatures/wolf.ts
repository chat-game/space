import { Sprite } from 'pixi.js'
import { BaseObject } from '../baseObject'
import type { GameScene, IGameObjectWolf } from '$lib/game/types'

interface IWolfOptions {
  scene: GameScene
  x: number
  y: number
}

export class Wolf extends BaseObject implements IGameObjectWolf {
  #animationSlowSpeed = 0.1

  constructor({ scene, x, y }: IWolfOptions) {
    super({ scene, x, y, type: 'WOLF' })

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
