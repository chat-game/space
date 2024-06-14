import { Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'

export class WagonCargoContainer extends GraphicsContainer {
  constructor() {
    super({ type: 'WAGON_CARGO', direction: 'RIGHT' })
  }

  static create() {
    const chest1 = Sprite.from('chest1')
    chest1.anchor.set(0.5, 1)
    chest1.visible = false

    const container = new WagonCargoContainer()
    container.addChild(chest1)

    container.x = 72
    container.y = -56

    return container
  }
}
