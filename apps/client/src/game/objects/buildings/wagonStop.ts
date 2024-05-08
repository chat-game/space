import { Sprite } from "pixi.js"
import type {
  IGameBuildingWagonStop,
  IGameObjectBuilding,
} from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Building } from "./building"

interface IWagonStopOptions {
  game: Game
  object: IGameBuildingWagonStop
}

export class WagonStop extends Building implements IGameBuildingWagonStop {
  constructor({ game, object }: IWagonStopOptions) {
    super({ game, object })

    this.init()
  }

  init() {
    const sprite = Sprite.from("wagonStop1")
    if (sprite) {
      sprite.anchor.set(0.5, 0.92)
      this.addChild(sprite)
    }
  }

  update(object: IGameObjectBuilding) {
    super.update(object)

    this.zIndex = Math.round(object.y - 100)
  }
}
