import type {
  IGameObjectMechanic,
  IGameObjectUnit,
} from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Unit } from "./unit"

interface IMechanicOptions {
  game: Game
  object: IGameObjectMechanic
}

export class Mechanic extends Unit implements IGameObjectMechanic {
  constructor({ game, object }: IMechanicOptions) {
    super({ game, object })
  }

  update(object: IGameObjectUnit) {
    super.update(object)

    this.zIndex = Math.round(object.y + 100)
  }
}
