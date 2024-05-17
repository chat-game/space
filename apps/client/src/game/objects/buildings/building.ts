import type { IGameObjectBuilding } from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { GameObjectContainer } from "../gameObjectContainer"

interface IBuildingOptions {
  game: Game
  object: IGameObjectBuilding
}

export class Building
  extends GameObjectContainer
  implements IGameObjectBuilding
{
  public inventory!: IGameObjectBuilding["inventory"]
  public speed: IGameObjectBuilding["speed"] = 0

  constructor({ game, object }: IBuildingOptions) {
    super({ game, ...object })

    this.update(object)
  }

  animate() {
    if (this.state === "DESTROYED") {
      this.visible = false
    }
  }

  update(object: IGameObjectBuilding) {
    super.update(object)

    this.inventory = object.inventory
  }
}
