import { Container, Sprite } from 'pixi.js'
import type {
  GraphicsContainerType,
  IGameObjectDirection,
} from '$lib/game/types'

interface IGraphicsContainerOptions {
  type: GraphicsContainerType
  direction?: IGameObjectDirection
}

export class GraphicsContainer extends Container {
  public type: GraphicsContainerType
  public direction: IGameObjectDirection = 'RIGHT'

  constructor({ type, direction }: IGraphicsContainerOptions) {
    super()
    this.type = type

    if (direction) {
      this.direction = direction
    }
  }

  static createWithSprite(
    spriteIndex: string,
    direction: IGameObjectDirection,
    type: GraphicsContainerType,
  ) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 1)

    const container = new GraphicsContainer({ type, direction })
    container.addChild(sprite)

    return container
  }
}
