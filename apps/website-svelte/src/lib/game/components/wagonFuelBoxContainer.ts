import { Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import { WagonFuelContainer } from './wagonFuelContainer'

export class WagonFuelBoxContainer extends GraphicsContainer {
  public children: Sprite[] | WagonFuelContainer[] = []

  constructor() {
    super({ type: 'WAGON_FUEL', direction: 'RIGHT' })
  }

  static create() {
    const storage = Sprite.from('wagonFuelContainer1')
    storage.anchor.set(0.5, 1)

    const container = new WagonFuelBoxContainer()
    const fuel = new WagonFuelContainer()
    container.addChild(storage, fuel)

    container.x = 0
    container.y = -18

    return container
  }
}
