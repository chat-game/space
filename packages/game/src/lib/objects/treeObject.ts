import type { GameAddon, GameObjectTree } from '../types'
import { Assets, Sprite } from 'pixi.js'
import { BaseObject } from './baseObject'

interface TreeObjectOptions {
  addon: GameAddon
  x: number
  y: number
}

export class TreeObject extends BaseObject implements GameObjectTree {
  variant: GameObjectTree['variant']

  constructor({ addon, x, y }: TreeObjectOptions) {
    super({ addon, x, y, type: 'TREE' })

    this.variant = 'GREEN'

    this.initVisual()
  }

  async initVisual(): Promise<void> {
    const texture = await Assets.load(`/objects/tree/green.png`)
    const sprite = Sprite.from(texture)
    sprite.anchor.set(0.5, 1)
    sprite.scale.set(1)
    sprite.eventMode = 'static'
    sprite.cursor = 'pointer'

    sprite.on('pointerdown', this.click.bind(this))

    this.addChild(sprite)
  }

  click() {
    this.scale.x *= 1.05
    this.scale.y *= 1.05

    const randomX = Math.floor(Math.random() * this.addon.app.stage.width)
    // this.addon.app.stage.addChild(new TreeObject({ addon: this.addon, x: randomX, y: 0 }))

    this.addon.websocketService.send({
      type: 'NEW_TREE',
      data: {
        id: this.id,
        x: randomX,
      },
    })
  }

  override live() {
    super.live()

    if (this.target?.state === 'DESTROYED') {
      this.target = undefined
    }
  }

  override animate() {
    super.animate()

    if (this.state === 'DESTROYED') {
      this.visible = false
      return
    }

    this.visible = true
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
