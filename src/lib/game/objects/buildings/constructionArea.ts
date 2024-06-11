import type { IGameBuildingConstructionArea } from "$lib/game/types"
import { Sprite } from "pixi.js"
import type { GameScene } from "../../scenes/gameScene"
import { Building } from "./building"

interface IConstructionAreaOptions {
  scene: GameScene
  x: number
  y: number
}

export class ConstructionArea
  extends Building
  implements IGameBuildingConstructionArea
{
  constructor({ scene, x, y }: IConstructionAreaOptions) {
    super({ scene, x, y })

    this.initGraphics()
  }

  private initGraphics() {
    const sprite = Sprite.from("constructionArea1")
    if (sprite) {
      sprite.anchor.set(0.5, 0.92)
      this.addChild(sprite)
    }
  }
}
