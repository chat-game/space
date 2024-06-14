import type { GameObject } from '../objects'
import { Script } from './script'
import type { IGameObject, IGameTask } from '$lib/game/types'

interface IPlantNewTreeScriptOptions {
  object: GameObject
  target: IGameObject
  plantNewTreeFunc: () => void
}

export class PlantNewTreeScript extends Script {
  constructor({
    target,
    object,
    plantNewTreeFunc,
  }: IPlantNewTreeScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.plantNewTree(plantNewTreeFunc),
    ]
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
