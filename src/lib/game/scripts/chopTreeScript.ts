import type { IGameObject, IGameTask } from "$lib/game/types"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IPlantNewTreeScriptOptions {
  object: GameObject
  target: IGameObject
  chopTreeFunc: () => boolean
}

export class ChopTreeScript extends Script {
  constructor({ target, object, chopTreeFunc }: IPlantNewTreeScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.chopTree(chopTreeFunc),
    ]
  }

  chopTree(func: () => boolean): IGameTask {
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
