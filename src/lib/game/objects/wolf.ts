import { Sprite } from "pixi.js"
import type { IGameObjectWolf } from "$lib/game/types"
import type { Game } from "../game"
import { GameObject } from "./gameObject.ts"

interface IWolfOptions {
  game: Game
  object: IGameObjectWolf
}

export class Wolf extends GameObject implements IGameObjectWolf {
  public animationAngle = 0
  public animationSlowSpeed = 0.1

  constructor({ game, object }: IWolfOptions) {
    super({ game, ...object })

    this.update(object)
    this.init()
  }

  init() {
    const spriteRight = Sprite.from("wolfRight")
    const spriteLeft = Sprite.from("wolfLeft")

    spriteRight.anchor.set(0.5, 1)
    spriteLeft.anchor.set(0.5, 1)

    spriteRight.direction = "RIGHT"
    spriteLeft.direction = "LEFT"

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
    if (Math.abs(this.animationAngle) >= 2) {
      this.animationSlowSpeed *= -1
    }
    this.animationAngle += this.animationSlowSpeed
    this.angle = this.animationAngle
  }
}
