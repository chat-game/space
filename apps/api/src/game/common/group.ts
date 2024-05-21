import { createId } from "@paralleldrive/cuid2"
import type {
  IGameGroup,
  IGameObjectPlayer,
} from "../../../../../packages/api-sdk/src"

export class Group implements IGameGroup {
  id: string
  players: IGameObjectPlayer[] = []

  constructor() {
    this.id = createId()
  }

  join(player: IGameObjectPlayer): boolean {
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
