import type { IGameObjectTrader } from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Unit } from "./unit"

interface ITraderOptions {
  game: Game
  object: IGameObjectTrader
}

export class Trader extends Unit implements IGameObjectTrader {
  constructor({ game, object }: ITraderOptions) {
    super({ game, object })
  }
}
