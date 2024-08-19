import { Sprite } from 'pixi.js'
import { BaseObject } from './baseObject'
import { getRandomInRange } from '$lib/utils/random'
import type { Game, GameObjectStone } from '$lib/game/types'

interface StoneOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
  resource?: number
  size?: number
  health?: number
}

export class StoneObject extends BaseObject implements GameObjectStone {
  public variant!: GameObjectStone['variant']
  public resource!: number

  public isReserved = false
  public animationAngle = 0
  public animationHighSpeed = 0.05

  constructor({ game, x, y, resource, size, chunkId }: StoneOptions) {
    super({ game, x, y, type: 'STONE' })

    this.chunkId = chunkId
    this.resource = resource ?? getRandomInRange(1, 5)
    this.size = size ?? 100

    this.#initGraphics()
  }

  #initGraphics() {
    const sprite = this.#getSprite()
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  #getSprite() {
    if (this.variant === '1') {
      return Sprite.from('stone1')
    }
  }

  animate() {
    super.animate()

    if (this.state === 'DESTROYED') {
      this.visible = false
    }

    if (this.state === 'MINING') {
      this.scale = 0.98
      this.#shakeAnimation()
    }
  }

  #shakeAnimation() {
    if (Math.abs(this.animationAngle) >= 0.5) {
      this.animationHighSpeed *= -1
    }
    this.animationAngle += this.animationHighSpeed
    this.angle = this.animationAngle
  }

  live() {
    if (this.state === 'MINING') {
      if (this.health <= 0) {
        this.setAsMined()
      }

      const random = getRandomInRange(1, 20)
      if (random <= 1 && this.health > 0) {
        this.state = 'IDLE'
        this.isReserved = false
      }
    }
  }

  mine() {
    this.state = 'MINING'
    this.isReserved = true
    this.health -= 0.08
  }

  setAsMined() {
    this.size = 0
    this.health = 0
    this.state = 'DESTROYED'
  }
}
