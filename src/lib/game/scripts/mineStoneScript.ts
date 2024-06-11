import type { IGameObject, IGameTask } from "$lib/game/types"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IMineStoneScriptOptions {
  object: GameObject
  target: IGameObject
  mineStoneFunc: () => boolean
}

export class MineStoneScript extends Script {
  constructor({ target, object, mineStoneFunc }: IMineStoneScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.mineStone(mineStoneFunc),
    ]
  }

  mineStone(func: () => boolean): IGameTask {
    return {
      id: "3",
      status: "IDLE",
      live: () => {
        const isFinished = func()
        if (isFinished) {
          this.markTaskAsDone()
        }
      },
    }
  }
}
