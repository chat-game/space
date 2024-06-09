import type { IGameObject, IGameTask, } from "$lib/game/types"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IMoveToTradePostAndTradeScriptOptions {
  object: GameObject
  target: IGameObject
  startTradeFunc: () => void
}

export class MoveToTradePostAndTradeScript extends Script {
  constructor({
                target,
                object,
                startTradeFunc,
              }: IMoveToTradePostAndTradeScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.startTrade(startTradeFunc),
    ]
  }

  startTrade(func: () => void): IGameTask {
    return {
      id: "3",
      status: "IDLE",
      live: () => {
        func()
        this.markTaskAsDone()
      },
    }
  }
}
