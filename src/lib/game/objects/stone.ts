import { Sprite } from "pixi.js"
import { type IGameObjectStone } from "$lib/game/types"
import type { GameScene } from "../scenes/gameScene"
import { GameObject } from "./gameObject"
import { getRandomInRange } from "$lib/random";

interface IStoneOptions {
  scene: GameScene
  x: number
  y: number
  resource?: number
  size?: number
  health?: number
}

export class Stone extends GameObject implements IGameObjectStone {
  public type!: IGameObjectStone["type"]
  public resource!: number

  public isReserved = false
  public animationAngle = 0
  public animationHighSpeed = 0.05

  constructor({ scene, x, y, resource, size }: IStoneOptions) {
    super({ scene, x, y })

    this.state = "IDLE"
    this.resource = resource ?? getRandomInRange(1, 5)
    this.size = size ?? 100

    this.initGraphics()
  }

  private initGraphics() {
    const sprite = this.getSpriteByType()
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  getSpriteByType() {
    if (this.type === "1") {
      return Sprite.from("stone1")
    }
  }

  public animate() {
    super.animate()

    if (this.state === "DESTROYED") {
      this.visible = false
    }

    if (this.state === "MINING") {
      this.scale = 0.98
      this.shakeAnimation()
    }
  }

  shakeAnimation() {
    if (Math.abs(this.animationAngle) >= 0.5) {
      this.animationHighSpeed *= -1
    }
    this.animationAngle += this.animationHighSpeed
    this.angle = this.animationAngle
  }

  live() {
    if (this.state === "MINING") {
      if (this.health <= 0) {
        this.setAsMined()
      }

      const random = getRandomInRange(1, 20)
      if (random <= 1 && this.health > 0) {
        this.state = "IDLE"
        this.isReserved = false
      }

      return
    }

    if (this.state === "DESTROYED") {
      return
    }
  }

  mine() {
    this.state = "MINING"
    this.isReserved = true
    this.health -= 0.08
  }

  setAsMined() {
    this.size = 0
    this.health = 0
    this.state = "DESTROYED"
  }
}
