import { BaseObject } from './baseObject'
import type { Game, IGameObjectArea } from '$lib/game/types'

interface IAreaOptions {
  game: Game
  theme: IGameObjectArea['theme']
  area: IGameObjectArea['area']
}

export class Area extends BaseObject implements IGameObjectArea {
  public theme: IGameObjectArea['theme']
  public area: IGameObjectArea['area']

  constructor({ game, theme, area }: IAreaOptions) {
    const x = area.startX
    const y = area.startY

    super({ game, x, y, type: 'AREA' })

    this.theme = theme
    this.area = area

    this.#initGraphics()
  }

  animate() {
    super.animate()

    this.zIndex = -1
  }

  #initGraphics() {
    const bg = this.game.bg.generateBackgroundTilingSprite(this.theme)
    bg.width = this.area.endX - this.area.startX
    bg.height = this.area.endY - this.area.startY

    this.addChild(bg)
  }
}
