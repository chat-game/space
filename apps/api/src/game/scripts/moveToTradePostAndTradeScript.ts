import type { IGameObject } from "../../../../../packages/api-sdk/src"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IMoveToTradePostAndTradeScriptOptions {
  object: GameObject
  target: IGameObject
}

export class MoveToTradePostAndTradeScript extends Script {
  constructor({ target, object }: IMoveToTradePostAndTradeScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget()]
  }
}
