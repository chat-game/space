import type {
  IGameObject,
  IGameTask,
} from "../../../../../packages/api-sdk/src"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IBuildScriptOptions {
  object: GameObject
  target: IGameObject
  buildFunc: () => boolean
}

export class BuildScript extends Script {
  constructor({ target, object, buildFunc }: IBuildScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.build(buildFunc),
    ]
  }

  build(func: () => boolean): IGameTask {
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
