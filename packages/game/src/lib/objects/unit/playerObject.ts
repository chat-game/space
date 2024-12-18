import type { CharacterEditionWithCharacter } from '@chat-game/types'
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
  reputation!: number
  villainPoints!: number
  refuellerPoints!: number
  raiderPoints!: number
  lastActionAt: GameObjectPlayer['lastActionAt']
  canClick: boolean
  nextClick: number

  public inventoryId?: string

  constructor({ addon, id, telegramId, x, y }: PlayerObjectOptions) {
    super({ addon, id, x, y, type: 'PLAYER' })

    this.telegramId = telegramId
    this.speedPerSecond = 70
    this.lastActionAt = new Date()
    this.canClick = true
    this.nextClick = 0
  }

  async initChar(character?: CharacterEditionWithCharacter): Promise<void> {
    super.initVisual(character?.character?.codename ?? 'telegramo')
  }

  click(): void {
    this.canClick = false
    this.nextClick = 15
  }

  addReputation(amount: number) {
    this.reputation += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     reputation: this.reputation,
    //   },
    // })
  }

  addRefuellerPoints(amount: number): void {
    if (amount < 0) {
      return
    }

    this.refuellerPoints += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     refuellerPoints: this.refuellerPoints,
    //   },
    // })
  }

  addVillainPoints(amount: number): void {
    this.villainPoints += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     villainPoints: {
    //       increment: amount,
    //     },
    //   },
    // })
  }

  addRaiderPoints(amount: number): void {
    this.raiderPoints += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     raiderPoints: {
    //       increment: amount,
    //     },
    //   },
    // })
  }

  async #readFromDB() {
    const player = await this.addon.serverService.getPlayer(this.id)
    if (!player) {
      return
    }

    this.name = player.name
    this.coins = player.coins
    this.reputation = player.reputation
    this.villainPoints = player.villainPoints
    this.refuellerPoints = player.refuellerPoints
    this.raiderPoints = player.raiderPoints
    this.inventoryId = player.inventoryId
  }

  updateLastActionAt(): void {
    this.lastActionAt = new Date()
  }
}
