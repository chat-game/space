import { Script } from './script'
import type { GameObject, IGameTask } from '$lib/game/types'

interface IPlantNewTreeScriptOptions {
  object: GameObject
  target: GameObject
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
      id: '3',
      status: 'IDLE',
      live: () => {
        const isFinished = func()
        if (isFinished) {
          this.markTaskAsDone()
        }
      },
    }
  }
}
