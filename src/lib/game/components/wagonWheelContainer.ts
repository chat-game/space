import { Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import type { IGameObjectDirection } from '$lib/game/types'

interface IWagonWheelContainerOptions {
  direction: IGameObjectDirection
  side: 'LEFT' | 'RIGHT'
}

export class WagonWheelContainer extends GraphicsContainer {
  public side: IWagonWheelContainerOptions['side']

  constructor({ direction, side }: IWagonWheelContainerOptions) {
    super({ type: 'WAGON_WHEEL', direction })
    this.side = side
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    side: IWagonWheelContainerOptions['side'],
  ) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 0.5)

    const container = new WagonWheelContainer({ direction, side })
    container.addChild(sprite)

    return container
  }
}
