import type { IGameObject, IGameTask } from "$lib/game/types"
import type { GameObject } from "../objects"
import { Script } from "./script"

interface IPlaceItemInWarehouseScriptOptions {
  object: GameObject
  target: IGameObject
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
      id: "3",
      status: "IDLE",
      live: () => {
        func()
        this.markTaskAsDone()
      },
    }
  }
}
