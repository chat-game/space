import { createId } from '@paralleldrive/cuid2'
import type { GameObjectPlayer, IGameGroup } from '$lib/game/types'

export class Group implements IGameGroup {
  id: string
  players: GameObjectPlayer[] = []

  constructor() {
    this.id = createId()
  }

  getGroup(): IGameGroup {
    return this
  }

  join(player: GameObjectPlayer): boolean {
    const check = this.findPlayer(player.id)
    if (check) {
      return false
    }

    this.players.push(player)
    return true
  }

  remove(player: GameObjectPlayer): boolean {
    const check = this.findPlayer(player.id)
    if (!check) {
      return false
    }

    const index = this.players.indexOf(player)
    this.players.splice(index, 1)
    return true
  }

  findPlayer(id: string) {
    return this.players.find((p) => p.id === id)
  }

  disband(): void {
    this.players = []
  }
}
