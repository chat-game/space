import { Sprite } from 'pixi.js'
import { BaseObject } from './baseObject'
import { getRandomInRange } from '$lib/random'
import type { Game, GameObjectTree } from '$lib/game/types'

interface TreeOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
  resource?: number
  size?: number
  health?: number
  growSpeed?: number
  theme?: GameObjectTree['theme']
  variant?: GameObjectTree['variant']
}

export class TreeObject extends BaseObject implements GameObjectTree {
  public variant!: GameObjectTree['variant']
  public theme!: GameObjectTree['theme']
  public resource!: number
  public isReadyToChop!: boolean

  public isReserved = false
  private minSizeToChop = 75
  private maxSize = 100
  private growSpeedPerSecond = 0.5
  private animationSpeedPerSecond = 3

  constructor({
    game,
    x,
    y,
    resource,
    size,
    health,
    theme,
    variant,
    chunkId,
  }: TreeOptions) {
    super({ game, x, y, type: 'TREE' })

    this.chunkId = chunkId
    this.resource = resource ?? getRandomInRange(1, 5)
    this.size = size ?? 100
    this.health = health ?? 100
    this.variant = variant ?? this.#getRandomVariant()
    this.theme = theme ?? this.#getRandomTheme()

    this.#initGraphics()
  }

  live() {
    this.#checkHealth()

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

  animate() {
    super.animate()

    this.scale = this.size / 100

    if (this.state === 'IDLE') {
      this.#shakeOnWind()
    }

    if (this.state === 'DESTROYED') {
      this.visible = false
    }

    if (this.state === 'CHOPPING') {
      this.#shakeAnimation()
    }
  }

  public chop() {
    this.state = 'CHOPPING'
    this.isReserved = true
    this.health -= 0.08
  }

  #initGraphics() {
    this.angle = getRandomInRange(-1, 1)

    const sprite = this.#getSprite()
    if (sprite) {
      sprite.anchor.set(0.5, 1)

      // Some random to flip horizontally
      const random = getRandomInRange(1, 2)
      if (random === 1) {
        sprite.scale.x = -1
      }

      this.addChild(sprite)
    }
  }

  #getSprite() {
    if (this.theme === 'GREEN') {
      return Sprite.from(`tree${this.variant}Green`)
    }
    if (this.theme === 'BLUE') {
      return Sprite.from(`tree${this.variant}Blue`)
    }
    if (this.theme === 'STONE') {
      return Sprite.from(`tree${this.variant}Stone`)
    }
    if (this.theme === 'TEAL') {
      return Sprite.from(`tree${this.variant}Teal`)
    }
    if (this.theme === 'TOXIC') {
      return Sprite.from(`tree${this.variant}Toxic`)
    }
    if (this.theme === 'VIOLET') {
      return Sprite.from(`tree${this.variant}Violet`)
    }
  }

  #shakeAnimation() {
    if (Math.abs(this.angle) < 3) {
      this.angle += (this.animationSpeedPerSecond * 5) / this.game.tick
      return
    }

    this.animationSpeedPerSecond *= -1
    this.angle
      += ((this.animationSpeedPerSecond * 5) / this.game.tick) * 10
  }

  #shakeOnWind() {
    if (Math.abs(this.angle) < 1.8) {
      this.angle += this.animationSpeedPerSecond / this.game.tick
      return
    }

    this.animationSpeedPerSecond *= -1
    this.angle += (this.animationSpeedPerSecond / this.game.tick) * 10
  }

  #checkHealth() {
    if (this.health <= 0) {
      this.destroy()
    }
  }

  #handleChoppingState() {
    const random = getRandomInRange(1, 20)
    if (random <= 1) {
      this.state = 'IDLE'
      this.isReserved = false
    }
  }

  #grow() {
    if (this.size >= this.minSizeToChop && !this.isReadyToChop) {
      this.isReadyToChop = true
    }
    if (this.size >= this.maxSize) {
      this.size = this.maxSize
      return
    }

    this.size += this.growSpeedPerSecond / this.game.tick
  }

  #getRandomVariant(): GameObjectTree['variant'] {
    const variants: GameObjectTree['variant'][] = ['1', '2', '3', '4', '5']
    const index = getRandomInRange(0, variants.length - 1)
    return variants[index]
  }

  #getRandomTheme(): GameObjectTree['theme'] {
    const themes: GameObjectTree['theme'][] = [
      'GREEN',
      'BLUE',
      'STONE',
      'TEAL',
      'TOXIC',
      'VIOLET',
    ]
    const index = getRandomInRange(0, themes.length - 1)
    return themes[index]
  }
}
