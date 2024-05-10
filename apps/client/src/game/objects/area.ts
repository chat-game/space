import type { IGameObjectArea } from "../../../../../packages/api-sdk/src"
import type { Game } from "../game"
import { GameObjectContainer } from "./gameObjectContainer"

interface IAreaOptions {
  game: Game
  object: IGameObjectArea
}

export class Area extends GameObjectContainer implements IGameObjectArea {
  public theme!: IGameObjectArea["theme"]
  public area!: IGameObjectArea["area"]

  constructor({ game, object }: IAreaOptions) {
    super({ game, ...object })

    this.update(object)
    void this.init()
  }

  async init() {
    this.game.bg.changePaletteByTheme(this.theme)

    const bg = await this.game.bg.getGeneratedBackgroundTilingSprite()
    bg.width = this.area.endX - this.area.startX
    bg.height = this.area.endY - this.area.startY
    this.addChild(bg)

    console.log(bg, this.theme)
  }

  animate() {
    super.animate()

    this.zIndex = -1
  }

  update(object: IGameObjectArea) {
    super.update(object)

    this.zIndex = -1
    this.theme = object.theme
    this.area = object.area
  }
}
