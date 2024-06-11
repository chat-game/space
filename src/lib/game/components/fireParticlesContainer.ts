import { getRandomInRange } from "$lib/random"
import { Sprite } from "pixi.js"
import { GraphicsContainer } from "./graphicsContainer"

interface IFireParticlesContainerOptions {
  x: number
  y: number
  areaWidth: number
}

export class FireParticlesContainer extends GraphicsContainer {
  public areaWidth: number
  public offset = 0

  constructor({ x, y, areaWidth }: IFireParticlesContainerOptions) {
    super({ type: "FIRE_PARTICLE", direction: "LEFT" })

    this.x = x
    this.y = y
    this.areaWidth = areaWidth
  }

  createRandom() {
    const sprite = Sprite.from(this.getRandomSpriteIndex())
    sprite.anchor.set(0.5, 1)

    const half = this.width / 2
    sprite.x = getRandomInRange(-half, half)
    sprite.scale = getRandomInRange(10, 20) / 10

    this.addChild(sprite)
  }

  getRandomSpriteIndex() {
    const random = getRandomInRange(1, 1000)
    if (random <= 500) {
      return "fireParticle1"
    }
    if (random <= 750) {
      return "fireParticle2"
    }
    return "fireParticle3"
  }

  animate(power = 1) {
    this.offset -= power + 1

    const activeNow = power * 8 + 1
    const canCreate = this.children.length < activeNow && this.offset <= 0
    if (canCreate) {
      this.createRandom()
      this.offset = power * getRandomInRange(90, 110) + 3
    }

    for (const container of this.children) {
      container.visible = true

      container.y -= 0.28
      container.alpha -= 0.008

      if (container.alpha <= 0) {
        this.removeChild(container)
      }
    }
  }
}
