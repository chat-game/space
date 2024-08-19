import { Script } from './script'
import type { GameObject, IGameTask } from '$lib/game/types'

interface IMoveOffScreenAndSelfDestroyScriptOptions {
  object: GameObject
  target: GameObject
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
      id: '3',
      status: 'IDLE',
      live: () => {
        func()
        this.markTaskAsDone()
      },
    }
  }
}
