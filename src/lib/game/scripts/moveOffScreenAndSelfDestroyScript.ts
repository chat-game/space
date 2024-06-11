import type { IGameObject, IGameTask } from "$lib/game/types"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IMoveOffScreenAndSelfDestroyScriptOptions {
  object: GameObject
  target: IGameObject
  selfDestroyFunc: () => void
}

export class MoveOffScreenAndSelfDestroyScript extends Script {
  constructor({
    target,
    object,
    selfDestroyFunc,
  }: IMoveOffScreenAndSelfDestroyScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.selfDestroy(selfDestroyFunc),
    ]
  }

  selfDestroy(func: () => void): IGameTask {
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
