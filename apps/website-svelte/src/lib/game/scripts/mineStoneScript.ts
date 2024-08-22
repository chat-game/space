import { Script } from './script'
import type { GameObject, IGameTask } from '$lib/game/types'

interface IMineStoneScriptOptions {
  object: GameObject
  target: GameObject
  mineStoneFunc: () => boolean
}

export class MineStoneScript extends Script {
  constructor({ target, object, mineStoneFunc }: IMineStoneScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget(), this.mineStone(mineStoneFunc)]
  }

  mineStone(func: () => boolean): IGameTask {
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
