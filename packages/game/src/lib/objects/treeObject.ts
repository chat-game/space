import type { GameAddon, GameObjectTree } from '../types'
import { Assets, Sprite } from 'pixi.js'
import { getRandomInRange } from '../utils/random'
import { BaseObject } from './baseObject'

interface TreeObjectOptions {
  addon: GameAddon
  x: number
  y: number
  size?: number
}

export class TreeObject extends BaseObject implements GameObjectTree {
  variant: GameObjectTree['variant']
  isReadyToChop!: boolean

  #minSizeToChop = 75
  #maxSize = 125
  #growSpeedPerSecond = 3
  #animationAngle = getRandomInRange(-1, 1)
  #animationSlowSpeed = 0.04
  #animationHighSpeed = 0.5

  constructor({ addon, x, y, size }: TreeObjectOptions) {
    super({ addon, x, y, type: 'TREE' })

    this.size = size ?? 100
    this.#maxSize = getRandomInRange(this.#minSizeToChop, this.#maxSize)

    this.health = 100
    this.variant = 'GREEN'

    this.zIndex = getRandomInRange(-1, 1)

    this.initVisual()
  }

  async initVisual(): Promise<void> {
    const texture = await Assets.load(`/objects/tree/green.png`)
    const sprite = Sprite.from(texture)
    sprite.anchor.set(0.5, 1)
    sprite.eventMode = 'static'
    sprite.cursor = 'pointer'

    sprite.on('pointerdown', this.click.bind(this))

    this.addChild(sprite)
  }

  click() {
    this.chop()

    // const randomX = Math.floor(Math.random() * this.addon.app.stage.width)

    // this.addon.websocketService.send({
    //   type: 'NEW_TREE',
    //   data: {
    //     id: this.id,
    //     x: randomX,
    //   },
    // })
  }

  chop() {
    this.state = 'CHOPPING'
    this.health -= getRandomInRange(10, 20)
    this.alpha = 0.9
  }

  override live() {
    super.live()

    if (this.target?.state === 'DESTROYED') {
      this.target = undefined
    }

    if (this.health <= 0) {
      this.destroy()
    }

    switch (this.state) {
      case 'IDLE':
        this.#grow()
        break
      case 'CHOPPING':
        this.#handleChoppingState()
        break
      case 'DESTROYED':
        break
    }
  }

  override animate() {
    super.animate()

    this.scale = this.size / 100

    if (this.state === 'IDLE') {
      this.#shakeOnWind()
    }

    if (this.state === 'CHOPPING') {
      this.#shakeAnimation()
    }

    if (this.state === 'DESTROYED') {
      this.visible = false
      return
    }

    this.visible = true
  }

  #shakeAnimation() {
    if (Math.abs(this.#animationAngle) >= 3.5) {
      this.#animationHighSpeed *= -1
    }
    this.#animationAngle += this.#animationHighSpeed
    this.angle = this.#animationAngle
  }

  #shakeOnWind() {
    if (Math.abs(this.#animationAngle) >= 1.5) {
      this.#animationSlowSpeed *= -1
    }
    this.#animationAngle += this.#animationSlowSpeed
    this.angle = this.#animationAngle
  }

  #grow() {
    if (this.size >= this.#minSizeToChop && !this.isReadyToChop) {
      this.isReadyToChop = true
    }
    if (this.size >= this.#maxSize) {
      return
    }

    this.size += this.#growSpeedPerSecond / this.addon.tick
  }

  #handleChoppingState() {
    const random = getRandomInRange(1, 20)
    if (random <= 1) {
      this.state = 'IDLE'
      this.alpha = 1
    }
  }

  // #getSpriteByType() {
  //   if (this.variant === 'GREEN') {
  //     return Sprite.from(`tree${this.type}Green`)
  //   }
  //   if (this.variant === 'BLUE') {
  //     return Sprite.from(`tree${this.type}Blue`)
  //   }
  //   if (this.variant === 'STONE') {
  //     return Sprite.from(`tree${this.type}Stone`)
  //   }
  //   if (this.variant === 'TEAL') {
  //     return Sprite.from(`tree${this.type}Teal`)
  //   }
  //   if (this.variant === 'TOXIC') {
  //     return Sprite.from(`tree${this.type}Toxic`)
  //   }
  //   if (this.variant === 'VIOLET') {
  //     return Sprite.from(`tree${this.type}Violet`)
  //   }
  // }
}
