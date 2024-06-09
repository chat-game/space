import { createId } from "@paralleldrive/cuid2"
import type { IGameGroup, IGameObjectPlayer, } from "$lib/game/types"
import type { Player } from "../objects/units"

export class Group implements IGameGroup {
  id: string
  players: IGameObjectPlayer[] = []

  constructor() {
    this.id = createId()
  }

  public getGroup(): IGameGroup {
    return {
      id: this.id,
      players: this.players.map((p) => {
        return {
          ...p,
          script: undefined,
          live: undefined,
        }
      }),
    }
  }

  join(player: Player): boolean {
    const check = this.findPlayer(player.id)
    if (check) {
      return false
    }

    this.players.push(player)
    return true
  }

  remove(player: IGameObjectPlayer): boolean {
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

  disband() {
    this.players = []
  }
}
