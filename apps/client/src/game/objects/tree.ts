import { Sprite } from "pixi.js"
import {
  type IGameObjectTree,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import type { Game } from "../game"
import { GameObjectContainer } from "./gameObjectContainer"

interface ITreeOptions {
  game: Game
  object: IGameObjectTree
}

export class Tree extends GameObjectContainer implements IGameObjectTree {
  public type!: IGameObjectTree["type"]
  public variant!: IGameObjectTree["variant"]
  public resource!: number
  public size!: number
  public isReadyToChop!: boolean

  public animationAngle = getRandomInRange(-1, 1)
  public animationSlowSpeed = 0.04
  public animationHighSpeed = 0.15

  constructor({ game, object }: ITreeOptions) {
    super({ game, ...object })

    this.update(object)
    this.init()
  }

  init() {
    const sprite = this.getSpriteByType()
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  getSpriteByType() {
    if (this.type === "1") {
      if (this.variant === "GREEN") {
        return Sprite.from("tree1Green")
      }
      if (this.variant === "BLUE") {
        return Sprite.from("tree1Blue")
      }
      if (this.variant === "STONE") {
        return Sprite.from("tree1Stone")
      }
      if (this.variant === "TEAL") {
        return Sprite.from("tree1Teal")
      }
      if (this.variant === "TOXIC") {
        return Sprite.from("tree1Toxic")
      }
      if (this.variant === "VIOLET") {
        return Sprite.from("tree1Violet")
      }
    }
    if (this.type === "2") {
      return Sprite.from("tree2")
    }
    if (this.type === "3") {
      const random = getRandomInRange(1, 3)
      if (random === 1) {
        return Sprite.from("tree3")
      }
      if (random === 2) {
        return Sprite.from("tree7")
      }
      if (random === 3) {
        return Sprite.from("tree10")
      }
    }
    if (this.type === "4") {
      return Sprite.from("tree4")
    }
    if (this.type === "5") {
      return Sprite.from("tree5")
    }
  }

  animate() {
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

  shakeAnimation() {
    if (Math.abs(this.animationAngle) >= 2.5) {
      this.animationHighSpeed *= -1
    }
    this.animationAngle += this.animationHighSpeed
    this.angle = this.animationAngle
  }

  shakeOnWind() {
    if (Math.abs(this.animationAngle) >= 1.5) {
      this.animationSlowSpeed *= -1
    }
    this.animationAngle += this.animationSlowSpeed
    this.angle = this.animationAngle
  }

  update(object: IGameObjectTree) {
    super.update(object)

    this.type = object.type
    this.variant = object.variant
    this.isReadyToChop = object.isReadyToChop
    this.resource = object.resource
    this.size = object.size
  }
}
