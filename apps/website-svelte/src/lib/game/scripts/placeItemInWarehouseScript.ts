import { Script } from './script'
import type { GameObject, IGameTask } from '$lib/game/types'

interface IPlaceItemInWarehouseScriptOptions {
  object: GameObject
  target: GameObject
  placeItemFunc: () => void
}

export class PlaceItemInWarehouseScript extends Script {
  constructor({
    target,
    object,
    placeItemFunc,
  }: IPlaceItemInWarehouseScriptOptions) {
    super({ object })

    this.tasks = [
      this.setTarget(target),
      this.runToTarget(),
      this.placeItem(placeItemFunc),
    ]
  }

  placeItem(func: () => void): IGameTask {
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
