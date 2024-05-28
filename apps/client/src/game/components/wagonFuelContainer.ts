import { Sprite } from "pixi.js"
import { getRandomInRange } from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

export class WagonFuelContainer extends GraphicsContainer {
  constructor() {
    super({ type: "WAGON_FUEL", direction: "RIGHT" })

    this.initFuelContainer()
  }

  initFuelContainer() {
    const offsetX = 76
    const offsetY = 52

    for (let i = 1; i < 10; i++) {
      const sprite = this.getRandomFuelSprite()
      sprite.x = i * 12 - offsetX
      sprite.y = -offsetY
      this.addChild(sprite)
    }
  }

  getRandomFuelSprite() {
    const random = getRandomInRange(1, 2)
    if (random === 1) {
      return Sprite.from("wagonFuel1")
    }
    return Sprite.from("wagonFuel2")
  }
}
