import type { IGameObjectTree } from "$lib/game/types"
import { getRandomInRange } from "$lib/random"
import { Sprite } from "pixi.js"
import type { GameScene } from "../scenes/gameScene"
import { GameObject } from "./gameObject"

interface ITreeOptions {
  scene: GameScene
  x: number
  y: number
  resource?: number
  size?: number
  health?: number
  growSpeed?: number
  type?: IGameObjectTree["type"]
  variant?: IGameObjectTree["variant"]
}

export class Tree extends GameObject implements IGameObjectTree {
  public type!: IGameObjectTree["type"]
  public variant!: IGameObjectTree["variant"]
  public resource!: number
  public isReadyToChop!: boolean

  public isReserved = false
  private minSizeToChop = 75
  private maxSize = 100
  private growSpeedPerSecond = 0.5
  private animationSpeedPerSecond = 3

  constructor({
    scene,
    x,
    y,
    resource,
    size,
    health,
    type,
    variant,
  }: ITreeOptions) {
    super({ scene, x, y })

    this.state = "IDLE"
    this.resource = resource ?? getRandomInRange(1, 5)
    this.size = size ?? 100
    this.health = health ?? 100
    this.type = type ?? this.getNewType()
    this.variant = variant ?? this.getNewVariant()

    this.initGraphics()
  }

  public live() {
    this.checkHealth()

    switch (this.state) {
      case "IDLE":
        this.grow()
        break
      case "CHOPPING":
        this.handleChoppingState()
        break
      case "DESTROYED":
        break
    }
  }

  public animate() {
    super.animate()

    this.scale = this.size / 100

    if (this.state === "IDLE") {
      this.shakeOnWind()
    }

    if (this.state === "DESTROYED") {
      this.visible = false
    }

    if (this.state === "CHOPPING") {
      this.shakeAnimation()
    }
  }

  public chop() {
    this.state = "CHOPPING"
    this.isReserved = true
    this.health -= 0.08
  }

  private initGraphics() {
    this.angle = getRandomInRange(-1, 1)

    const sprite = this.getSpriteByType()
    if (sprite) {
      sprite.anchor.set(0.5, 1)

      // Some random to flip horizontally
      const random = getRandomInRange(1, 2)
      if (random === 1) {
        sprite.scale.x = -1
      }

      this.addChild(sprite)
    }
  }

  private getSpriteByType() {
    if (this.variant === "GREEN") {
      return Sprite.from(`tree${this.type}Green`)
    }
    if (this.variant === "BLUE") {
      return Sprite.from(`tree${this.type}Blue`)
    }
    if (this.variant === "STONE") {
      return Sprite.from(`tree${this.type}Stone`)
    }
    if (this.variant === "TEAL") {
      return Sprite.from(`tree${this.type}Teal`)
    }
    if (this.variant === "TOXIC") {
      return Sprite.from(`tree${this.type}Toxic`)
    }
    if (this.variant === "VIOLET") {
      return Sprite.from(`tree${this.type}Violet`)
    }
  }

  private shakeAnimation() {
    if (Math.abs(this.angle) < 3) {
      this.angle += (this.animationSpeedPerSecond * 5) / this.scene.game.tick
      return
    }

    this.animationSpeedPerSecond *= -1
    this.angle +=
      ((this.animationSpeedPerSecond * 5) / this.scene.game.tick) * 10
  }

  private shakeOnWind() {
    if (Math.abs(this.angle) < 1.8) {
      this.angle += this.animationSpeedPerSecond / this.scene.game.tick
      return
    }

    this.animationSpeedPerSecond *= -1
    this.angle += (this.animationSpeedPerSecond / this.scene.game.tick) * 10
  }

  private checkHealth() {
    if (this.health <= 0) {
      this.destroy()
    }
  }

  private handleChoppingState() {
    const random = getRandomInRange(1, 20)
    if (random <= 1) {
      this.state = "IDLE"
      this.isReserved = false
    }
  }

  private grow() {
    if (this.size >= this.minSizeToChop && !this.isReadyToChop) {
      this.isReadyToChop = true
    }
    if (this.size >= this.maxSize) {
      this.size = this.maxSize
      return
    }

    this.size += this.growSpeedPerSecond / this.scene.game.tick
  }

  private getNewType(): IGameObjectTree["type"] {
    const types: IGameObjectTree["type"][] = ["1", "2", "3", "4", "5"]
    const index = getRandomInRange(0, types.length - 1)
    return types[index]
  }

  private getNewVariant(): IGameObjectTree["variant"] {
    const variants: IGameObjectTree["variant"][] = [
      "GREEN",
      "BLUE",
      "STONE",
      "TEAL",
      "TOXIC",
      "VIOLET",
    ]
    const index = getRandomInRange(0, variants.length - 1)
    return variants[index]
  }
}
