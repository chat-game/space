import { BaseObject } from './baseObject'
import type { GameAddon, GameObjectFlag } from '../types'

interface FlagObjectOptions {
  addon: GameAddon
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

  constructor({ addon, x, y, variant, offsetX, offsetY }: FlagObjectOptions) {
    super({ addon, x, y, type: 'FLAG' })

    this.variant = variant
    this.isReserved = false
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0

    this.visible = false
  }

  override live() {
    super.live()

    if (this.target?.state === 'DESTROYED') {
      this.target = undefined
    }
  }

  override animate() {
    super.animate()

    if (this.addon.checkIfThisFlagIsTarget(this.id)) {
      this.visible = true
      return
    }

    if (this.state === 'DESTROYED') {
      this.visible = false
      return
    }

    this.visible = false
  }
}
