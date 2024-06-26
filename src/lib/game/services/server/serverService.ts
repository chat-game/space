import type { Inventory, Player } from '@hmbanan666/chat-game-api'
import type { GameServerService } from './interface'
import type { Game } from '$lib/game/types'

export class ServerService implements GameServerService {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {}

  async getPlayer(id: string): Promise<Player | null> {
    try {
      const res = await fetch(`/auth/game/player/${id}`)
      const player = await res.json() as Player
      if (!player?.id) {
        return null
      }

      return player
    } catch (err) {
      return null
    }
  }

  async getInventory(id: string): Promise<Inventory | null> {
    try {
      const res = await fetch(`/auth/game/inventory/${id}`)
      const inventory = await res.json() as Inventory
      if (!inventory) {
        return null
      }

      return inventory
    } catch (err) {
      return null
    }
  }
}
