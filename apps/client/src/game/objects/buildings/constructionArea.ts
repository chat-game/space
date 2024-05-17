import { Sprite } from "pixi.js"
import type {
  IGameBuildingConstructionArea,
  IGameObjectBuilding,
} from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Building } from "./building"

interface IConstructionAreaOptions {
  game: Game
  object: IGameBuildingConstructionArea
}

export class ConstructionArea
  extends Building
  implements IGameBuildingConstructionArea
{
  constructor({ game, object }: IConstructionAreaOptions) {
    super({ game, object })

    this.init()
  }

  init() {
    const sprite = Sprite.from("constructionArea1")
    if (sprite) {
      sprite.anchor.set(0.5, 0.92)
      this.addChild(sprite)
    }
  }

  update(object: IGameObjectBuilding) {
    super.update(object)

    this.zIndex = Math.round(object.y - 5)
  }
}
