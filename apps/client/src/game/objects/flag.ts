import { Sprite } from "pixi.js"
import type { IGameObjectFlag } from "../../../../../packages/api-sdk/src"
import type { GameScene } from "../scenes/gameScene.ts"
import { GameObject } from "./gameObject.ts"

interface IFlagOptions {
  scene: GameScene
  x: number
  y: number
  type: IGameObjectFlag["type"]
  offsetX?: number
  offsetY?: number
}

export class Flag extends GameObject implements IGameObjectFlag {
  public type!: IGameObjectFlag["type"]

  public isReserved: boolean
  public offsetX: number
  public offsetY: number

  constructor({ scene, x, y, type, offsetX, offsetY }: IFlagOptions) {
    super({ scene, x, y })

    this.type = type
    this.isReserved = false
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0

    this.visible = false

    this.initGraphics()
  }

  public live() {
    if (this.target?.state === "DESTROYED") {
      this.removeTarget()
    }
  }

  private initGraphics() {
    const sprite = this.getSpriteByType()
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  getSpriteByType() {
    if (
      this.type === "MOVEMENT" ||
      this.type === "WAGON_NEAR_MOVEMENT" ||
      this.type === "WAGON_MOVEMENT"
    ) {
      return Sprite.from("flag1")
    }
    if (this.type === "RESOURCE") {
      return Sprite.from("flag2")
    }
  }

  public animate() {
    if (this.scene.game.checkIfThisFlagIsTarget(this.id)) {
      this.visible = true
      return
    }

    if (this.type === "WAGON_MOVEMENT") {
      this.visible = true
      return
    }

    if (this.state === "DESTROYED") {
      this.visible = false
      return
    }

    this.visible = false
  }
}
