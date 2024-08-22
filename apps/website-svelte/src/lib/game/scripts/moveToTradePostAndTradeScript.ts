import { Script } from './script'
import type { GameObject, IGameTask } from '$lib/game/types'

interface IMoveToTradePostAndTradeScriptOptions {
  object: GameObject
  target: GameObject
  startTradeFunc: () => void
}

export class MoveToTradePostAndTradeScript extends Script {
  constructor({ target, object, startTradeFunc }: IMoveToTradePostAndTradeScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget(), this.startTrade(startTradeFunc)]
  }

  startTrade(func: () => void): IGameTask {
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
