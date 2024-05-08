import { Sprite } from "pixi.js"
import type { IGameObjectDirection } from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

interface IWagonEngineContainerOptions {
  direction: IGameObjectDirection
}

export class WagonEngineContainer extends GraphicsContainer {
  constructor({ direction }: IWagonEngineContainerOptions) {
    super({ type: "WAGON_ENGINE", direction })
  }

  static create(spriteIndex: string, direction: IGameObjectDirection) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 1)

    const container = new WagonEngineContainer({ direction })
    container.addChild(sprite)

    return container
  }
}
