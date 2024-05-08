import { Sprite } from "pixi.js"
import type { IGameObjectRabbit } from "../../../../../packages/api-sdk/src"
import type { Game } from "../game"
import { GameObjectContainer } from "./gameObjectContainer"

interface IRabbitOptions {
  game: Game
  object: IGameObjectRabbit
}

export class Rabbit extends GameObjectContainer implements IGameObjectRabbit {
  public animationAngle = 0

  constructor({ game, object }: IRabbitOptions) {
    super({ game, ...object })

    this.update(object)
    this.init()
  }

  init() {
    const spriteRight = Sprite.from("rabbitRight")
    const spriteLeft = Sprite.from("rabbitLeft")

    spriteRight.anchor.set(0.5, 1)
    spriteLeft.anchor.set(0.5, 1)

    spriteLeft.direction = "LEFT"
    spriteRight.direction = "RIGHT"

    this.addChild(spriteRight, spriteLeft)
  }

  animate() {
    // Hide all
    for (const t of this.children) {
      t.visible = false
    }

    // Visible only 1
    const sprite = this.children.find((t) => t.direction === this.direction)
    if (sprite) {
      sprite.visible = true
    }

    if (this.state === "MOVING") {
      this.angle = this.animationAngle
      this.shakeAnimation()
    }
  }

  shakeAnimation() {
    if (this.animationAngle >= 4) {
      this.animationAngle = 0
      return
    }
    this.animationAngle += 0.08
  }
}
