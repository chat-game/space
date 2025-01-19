import type { GameAddon, GameObjectPlayer } from './../../types'
import { UnitObject } from './unitObject'

interface PlayerObjectOptions {
  addon: GameAddon
  id: string
  telegramId: string
  x: number
  y: number
}

export class PlayerObject extends UnitObject implements GameObjectPlayer {
  telegramId: string
  canClick: boolean
  nextClick: number

  constructor({ addon, id, telegramId, x, y }: PlayerObjectOptions) {
    super({ addon, id, x, y, type: 'PLAYER' })

    this.telegramId = telegramId
    this.speedPerSecond = 70
    this.canClick = true
    this.nextClick = 0
  }

  click(): void {
    this.canClick = false
    this.nextClick = 15
  }
}
