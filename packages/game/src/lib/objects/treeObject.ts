import type { GameAddon, GameObjectTree } from '../types'
import { getRandomInRange } from '../utils/random'
import { BaseObject } from './baseObject'

interface TreeObjectOptions {
  addon: GameAddon
  x: number
  y: number
  id?: string
  zIndex?: number
  size?: number
  maxSize?: number
  treeType?: GameObjectTree['treeType']
  variant?: GameObjectTree['variant']
}

export class TreeObject extends BaseObject implements GameObjectTree {
  variant: GameObjectTree['variant']
  treeType: GameObjectTree['treeType']
  isAnObstacleToWagon = false
  minSizeToChop = 75
  maxSize: number
  growSpeedPerSecond = getRandomInRange(2, 4)
  animationAngle = getRandomInRange(-1, 1)
  animationSlowSpeed = 0.04
  animationHighSpeed = 0.5

  constructor({ addon, x, y, size, maxSize, id, zIndex, treeType, variant }: TreeObjectOptions) {
    super({ id, addon, x, y, type: 'TREE' })

    this.health = 100
    this.size = size ?? 100
    this.maxSize = maxSize ?? getRandomInRange(this.minSizeToChop, 145)
    this.variant = variant ?? 'GREEN'
    this.treeType = treeType ?? this.getNewType()
    this.zIndex = zIndex ?? getRandomInRange(-10, 1)
    this.isAnObstacleToWagon = this.zIndex >= -5

    this.initVisual()
  }

  initVisual() {
    const alias = this.getSpriteByType()
    const sprite = this.addon.assetService.sprite(alias)
    sprite.anchor.set(0.5, 1)
    sprite.eventMode = 'static'
    sprite.cursor = 'pointer'

    sprite.on('pointerdown', this.click.bind(this))

    this.addChild(sprite)
  }

  click() {
    if (!this.addon.player || !this.addon.player?.canClick) {
      return
    }

    this.addon.player.click()
    this.addon.vibrate()
    this.chop()
  }

  chop() {
    this.state = 'CHOPPING'
    this.health -= getRandomInRange(9, 15)
    this.alpha = 0.9
  }

  override live() {
    super.live()

    if (this.health <= 0) {
      this.destroy()
      return
    }

    if (this.state === 'CHOPPING') {
      this.handleChoppingState()
    }
  }

  override animate() {
    super.animate()

    this.scale = this.size / 100

    if (this.state === 'IDLE') {
      this.shakeOnWind()
    }

    if (this.state === 'CHOPPING') {
      this.shakeAnimation()
    }
  }

  shakeAnimation() {
    if (Math.abs(this.animationAngle) >= 3.5) {
      this.animationHighSpeed *= -1
    }
    this.animationAngle += this.animationHighSpeed
    this.angle = this.animationAngle
  }

  shakeOnWind() {
    if (Math.abs(this.animationAngle) >= 1.5) {
      this.animationSlowSpeed *= -1
    }
    this.animationAngle += this.animationSlowSpeed
    this.angle = this.animationAngle
  }

  handleChoppingState() {
    const random = getRandomInRange(1, 20)
    if (random <= 1) {
      this.state = 'IDLE'
      this.alpha = 1
    }
  }

  getNewType(): GameObjectTree['treeType'] {
    const items = ['1', '2', '3', '4', '5'] as const
    return items[Math.floor(Math.random() * items.length)] as GameObjectTree['treeType']
  }

  getSpriteByType() {
    if (this.variant === 'GREEN') {
      return `TREE_${this.treeType}_GREEN`
    }
    if (this.variant === 'BLUE') {
      return `TREE_${this.treeType}_BLUE`
    }
    if (this.variant === 'STONE') {
      return `TREE_${this.treeType}_STONE`
    }
    if (this.variant === 'TEAL') {
      return `TREE_${this.treeType}_TEAL`
    }
    if (this.variant === 'TOXIC') {
      return `TREE_${this.treeType}_TOXIC`
    }
    if (this.variant === 'VIOLET') {
      return `TREE_${this.treeType}_VIOLET`
    }

    return `TREE_${this.treeType}_GREEN`
  }
}
