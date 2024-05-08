import { type Container, Sprite } from "pixi.js"
import { getRandomInRange } from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

export class WagonEngineCloudsContainer extends GraphicsContainer {
  public offset = 0

  constructor() {
    super({ type: "WAGON_ENGINE_CLOUD", direction: "LEFT" })

    this.x = -106
    this.y = -118
  }

  createRandom() {
    const sprite = Sprite.from(this.getRandomSpriteIndex())
    sprite.anchor.set(0.5, 1)
    sprite.scale = 0.75
    sprite.visible = false

    this.addChild(sprite)
  }

  getRandomSpriteIndex() {
    const random = getRandomInRange(1, 1000)
    if (random <= 500) {
      return "wagonEngineCloud1"
    }
    if (random <= 750) {
      return "wagonEngineCloud2"
    }
    if (random <= 995) {
      return "wagonEngineCloud3"
    }
    return "wagonEngineCloud4"
  }

  remove(container: Container) {
    return this.removeChild(container)
  }

  animate(speed: number) {
    this.offset -= speed + 1

    const cloudsActive = speed * 8 + 1
    const canCreateCloud =
      this.children.length < cloudsActive && this.offset <= 0
    if (canCreateCloud) {
      this.createRandom()
      this.offset = speed * getRandomInRange(170, 190) + 3
    }

    for (const container of this.children) {
      container.visible = true

      container.x -= speed / 3 + 0.07
      container.y -= 0.06
      container.scale = 0.75
      container.alpha -= 0.005

      if (container.alpha <= 0) {
        this.remove(container)
      }
    }
  }
}
