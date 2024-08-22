import { Script } from './script'
import type { GameObject, IGameTask } from '$lib/game/types'

interface IPlantNewTreeScriptOptions {
  object: GameObject
  target: GameObject
  plantNewTreeFunc: () => void
}

export class PlantNewTreeScript extends Script {
  constructor({ target, object, plantNewTreeFunc }: IPlantNewTreeScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget(), this.plantNewTree(plantNewTreeFunc)]
  }

  plantNewTree(func: () => void): IGameTask {
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
