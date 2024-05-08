import type { IGameObjectCourier } from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Unit } from "./unit"

interface ICourierOptions {
  game: Game
  object: IGameObjectCourier
}

export class Courier extends Unit implements IGameObjectCourier {
  constructor({ game, object }: ICourierOptions) {
    super({ game, object })
  }
}
