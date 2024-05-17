import type {
  IGameObjectPlayer,
  IGameSkill,
} from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Unit } from "./unit"

interface IPlayerOptions {
  game: Game
  object: IGameObjectPlayer
}

export class Player extends Unit implements IGameObjectPlayer {
  reputation!: number
  villainPoints!: number
  refuellerPoints!: number
  raiderPoints!: number
  skills!: IGameSkill[]
  lastActionAt!: IGameObjectPlayer["lastActionAt"]

  constructor({ game, object }: IPlayerOptions) {
    super({ game, object })
    this.update(object)

    this.init()
  }

  update(object: IGameObjectPlayer) {
    super.update(object)

    this.reputation = object.reputation
    this.villainPoints = object.villainPoints
    this.refuellerPoints = object.refuellerPoints
    this.raiderPoints = object.raiderPoints
    this.skills = object.skills
    this.lastActionAt = object.lastActionAt
  }
}
