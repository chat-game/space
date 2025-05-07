import type { GameAddon, GameObjectPlayer } from './../../types'
import { UnitObject } from './unitObject'

interface PlayerObjectOptions {
  addon: GameAddon
  id: string
  x: number
  y: number
}

export class PlayerObject extends UnitObject implements GameObjectPlayer {
  lastActionAt: GameObjectPlayer['lastActionAt']

  constructor({ addon, id, x, y }: PlayerObjectOptions) {
    super({ addon, id, x, y, type: 'PLAYER' })

    this.speedPerSecond = 70
    this.lastActionAt = new Date()
  }

  async init(name: string, codename: string | undefined | null): Promise<void> {
    super.initVisual(codename)
    this.name = name
    this.drawUserName(name)
  }

  updateLastActionAt(): void {
    this.lastActionAt = new Date()
  }
}
