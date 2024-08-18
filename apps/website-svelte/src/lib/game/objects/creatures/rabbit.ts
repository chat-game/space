import { Sprite } from 'pixi.js'
import { BaseObject } from '../baseObject'
import type { Game, IGameObjectRabbit } from '$lib/game/types'

interface RabbitOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Rabbit extends BaseObject implements IGameObjectRabbit {
  public animationAngle = 0

  constructor({ game, x, y, chunkId }: RabbitOptions) {
    super({ game, x, y, type: 'RABBIT' })

    this.chunkId = chunkId

    this.#init()
  }

  #init() {
    const spriteRight = Sprite.from('rabbitRight')
    const spriteLeft = Sprite.from('rabbitLeft')

    spriteRight.anchor.set(0.5, 1)
    spriteLeft.anchor.set(0.5, 1)

    this.addChild(spriteRight, spriteLeft)
  }

  animate() {
    // Hide all
    for (const t of this.children) {
      t.visible = false
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
