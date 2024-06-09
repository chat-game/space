import type { IGameObjectArea } from "$lib/game/types"
import type { GameScene } from "../scenes/gameScene.ts"
import { GameObject } from "./gameObject.ts"

interface IAreaOptions {
  scene: GameScene
  theme: IGameObjectArea["theme"]
  area: IGameObjectArea["area"]
}

export class Area extends GameObject implements IGameObjectArea {
  public theme: IGameObjectArea["theme"]
  public area: IGameObjectArea["area"]

  constructor({ scene, theme, area }: IAreaOptions) {
    const x = area.startX
    const y = area.startY

    super({ scene, x, y })

    this.theme = theme
    this.area = area

    this.initGraphics()
  }

  private initGraphics() {
    this.scene.game.bg.changePaletteByTheme(this.theme)

    const bg = this.scene.game.bg.getGeneratedBackgroundTilingSprite()
    bg.width = this.area.endX - this.area.startX
    bg.height = this.area.endY - this.area.startY

    this.addChild(bg)
  }

  animate() {
    super.animate()

    this.zIndex = -1
  }
}
