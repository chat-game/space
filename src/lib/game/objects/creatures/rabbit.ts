import { Sprite } from 'pixi.js'
import { BaseObject } from '../baseObject'
import type { GameScene, IGameObjectRabbit } from '$lib/game/types'

interface RabbitOptions {
  scene: GameScene
  x: number
  y: number
}

export class Rabbit extends BaseObject implements IGameObjectRabbit {
  public animationAngle = 0

  constructor({ scene, x, y }: RabbitOptions) {
    super({ scene, x, y, type: 'RABBIT' })

    this.#init()
  }

  #init() {
    const spriteRight = Sprite.from('rabbitRight')
    const spriteLeft = Sprite.from('rabbitLeft')

    spriteRight.anchor.set(0.5, 1)
    spriteLeft.anchor.set(0.5, 1)

    spriteLeft.direction = 'LEFT'
    spriteRight.direction = 'RIGHT'

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
      this.angle = this.animationAngle
      this.shakeAnimation()
    }
  }

  shakeAnimation() {
    if (this.animationAngle >= 4) {
      this.animationAngle = 0
      return
    }
    this.animationAngle += 0.08
  }
}
