import type { GameObject, Task } from '../types'
import { BaseScript } from './baseScript'

interface IMoveOffScreenAndSelfDestroyScriptOptions {
  object: GameObject
  target: GameObject
  selfDestroyFunc: () => void
}

export class MoveOffScreenAndSelfDestroyScript extends BaseScript {
  constructor({ target, object, selfDestroyFunc }: IMoveOffScreenAndSelfDestroyScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.selfDestroy(selfDestroyFunc),
    ]
  }

  selfDestroy(func: () => void): Task {
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
