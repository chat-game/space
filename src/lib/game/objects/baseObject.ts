import { createId } from '@paralleldrive/cuid2'
import { Container } from 'pixi.js'
import type { GameObject, GameScene, IGameScript } from '$lib/game/types'

interface GameObjectOptions {
  scene: GameScene
  type: GameObject['type']
  id?: string
  x?: number
  y?: number
}

export class BaseObject extends Container implements GameObject {
  id: GameObject['id']
  state: GameObject['state']
  direction: GameObject['direction']
  type: GameObject['type']
  target: GameObject['target']
  health!: GameObject['health']
  speedPerSecond!: GameObject['speedPerSecond']
  size!: GameObject['size']

  scene: GameScene
  script: IGameScript
  minDistance = 1
  isOnWagonPath = false

  constructor({ scene, x, y, id, type }: GameObjectOptions) {
    super()

    this.scene = scene

    this.id = id ?? createId()
    this.x = x ?? 0
    this.y = y ?? 0
    this.type = type
    this.direction = 'RIGHT'
    this.state = 'IDLE'

    this.scene.game.addChild(this)
  }

  animate(): void {
    this.zIndex = Math.round(this.y)
  }

  move(): boolean {
    const isOnTarget = this.#checkIfIsOnTarget()
    if (isOnTarget) {
      this.#stop()
      return false
    }

    if (!this.target || !this.target.x || !this.target.y) {
      this.#stop()
      return false
    }

    const distanceToX = this.#getDistanceToTargetX()
    const distanceToY = this.#getDistanceToTargetY()

    // Fix diagonal speed
    const speed = this.speedPerSecond / this.scene.game.tick
    const finalSpeed = distanceToX > 0 && distanceToY > 0 ? speed * 0.75 : speed

    this.#moveX(finalSpeed > distanceToX ? distanceToX : finalSpeed)
    this.#moveY(finalSpeed > distanceToY ? distanceToY : finalSpeed)
    return true
  }

  setTarget(target: GameObject) {
    this.target = target
    this.state = 'MOVING'
  }

  removeTarget() {
    this.target = undefined
  }

  destroy() {
    super.destroy()
    this.size = 0
    this.health = 0
    this.state = 'DESTROYED'
  }

  #moveX(speed: number) {
    if (!this.target?.x || this.target.x === this.x) {
      return
    }

    if (this.x < this.target.x) {
      this.direction = 'RIGHT'
      this.x += speed
    }
    if (this.x > this.target.x) {
      this.x -= speed
      this.direction = 'LEFT'
    }
  }

  #moveY(speed: number) {
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

  #stop() {
    this.state = 'IDLE'
  }

  #checkIfIsOnTarget() {
    return (
      this.#getDistanceToTargetX() + this.#getDistanceToTargetY()
      <= this.minDistance
    )
  }

  #getDistanceToTargetX() {
    if (!this.target?.x) {
      return 0
    }
    return Math.abs(this.target.x - this.x)
  }

  #getDistanceToTargetY() {
    if (!this.target?.y) {
      return 0
    }
    return Math.abs(this.target.y - this.y)
  }
}
