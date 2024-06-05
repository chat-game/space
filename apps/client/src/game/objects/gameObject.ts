import { createId } from "@paralleldrive/cuid2"
import { Container } from "pixi.js"
import type {
  IGameObject,
  IGameScript,
} from "../../../../../packages/api-sdk/src"
import type { GameScene } from "../scenes/gameScene.ts"

interface IGameObjectOptions {
  scene: GameScene
  id?: string
  x?: number
  y?: number
}

export class GameObject extends Container implements IGameObject {
  public id: string
  public state!: IGameObject["state"]
  public direction: IGameObject["direction"]
  public entity: IGameObject["entity"]
  public target: IGameObject["target"]
  public health!: IGameObject["health"]
  public speedPerSecond!: IGameObject["speedPerSecond"]
  public size!: IGameObject["size"]

  public scene: GameScene
  public script: IGameScript | undefined
  public minDistance = 1
  public isOnWagonPath = false

  constructor({ scene, x, y, id }: IGameObjectOptions) {
    super()

    this.scene = scene

    this.id = id ?? createId()
    this.x = x ?? 0
    this.y = y ?? 0
    this.entity = "TREE"
    this.direction = "RIGHT"

    this.scene.game.addChild(this)
  }

  animate(): void {
    this.zIndex = Math.round(this.y)
  }

  live(): void {}

  public move() {
    const isOnTarget = this.checkIfIsOnTarget()
    if (isOnTarget) {
      this.stop()
      return false
    }

    if (!this.target || !this.target.x || !this.target.y) {
      this.stop()
      return false
    }

    const distanceToX = this.getDistanceToTargetX()
    const distanceToY = this.getDistanceToTargetY()

    // Fix diagonal speed
    const speed = this.speedPerSecond / this.scene.game.tick
    const finalSpeed = distanceToX > 0 && distanceToY > 0 ? speed * 0.75 : speed

    this.moveX(finalSpeed > distanceToX ? distanceToX : finalSpeed)
    this.moveY(finalSpeed > distanceToY ? distanceToY : finalSpeed)
    return true
  }

  moveX(speed: number) {
    if (!this.target?.x || this.target.x === this.x) {
      return
    }

    if (this.x < this.target.x) {
      this.direction = "RIGHT"
      this.x += speed
    }
    if (this.x > this.target.x) {
      this.x -= speed
      this.direction = "LEFT"
    }
  }

  moveY(speed: number) {
    if (!this.target?.y || this.target.y === this.y) {
      return
    }

    if (this.y < this.target.y) {
      this.y += speed
    }
    if (this.y > this.target.y) {
      this.y -= speed
    }
  }

  stop() {
    this.state = "IDLE"
  }

  public destroy() {
    super.destroy()
    this.size = 0
    this.health = 0
    this.state = "DESTROYED"
  }

  checkIfIsOnTarget() {
    return (
      this.getDistanceToTargetX() + this.getDistanceToTargetY() <=
      this.minDistance
    )
  }

  getDistanceToTargetX() {
    if (!this.target?.x) {
      return 0
    }
    return Math.abs(this.target.x - this.x)
  }

  getDistanceToTargetY() {
    if (!this.target?.y) {
      return 0
    }
    return Math.abs(this.target.y - this.y)
  }

  public setTarget(target: IGameObject) {
    this.target = target
    this.state = "MOVING"
  }

  public removeTarget() {
    this.target = undefined
  }
}
