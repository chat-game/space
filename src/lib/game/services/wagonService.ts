import { Flag, Wagon } from "../objects"
import type { GameScene } from "../scenes/gameScene"
import { RouteService } from "./routeService"
import { getRandomInRange, getMinusOrPlus } from "$lib/random";

interface IWagonServiceOptions {
  scene: GameScene
}

export class WagonService {
  public wagon!: Wagon
  public outFlags: Flag[] = []
  public nearFlags: Flag[] = []
  public routeService: RouteService
  public scene: GameScene

  constructor({ scene }: IWagonServiceOptions) {
    this.scene = scene
    this.routeService = new RouteService({ scene })
  }

  public update() {
    this.updateWagon()
    this.updateFlags()
    this.routeService.update()
  }

  public initWagon({ x, y }: { x: number; y: number }) {
    this.wagon = new Wagon({ scene: this.scene, x, y })

    this.initOutFlags()
    this.initNearFlags()
  }

  public findRandomOutFlag() {
    return this.outFlags[Math.floor(Math.random() * this.outFlags.length)]
  }

  public findRandomNearFlag() {
    return this.nearFlags[Math.floor(Math.random() * this.nearFlags.length)]
  }

  private updateWagon() {
    const collisionObjects =
      this.scene.chunkNow?.objects.filter(
        (obj) => obj.isOnWagonPath && obj.state !== "DESTROYED",
      ) ?? []
    for (const collisionObject of collisionObjects) {
      const isInArea = this.wagon.checkIfPointInCollisionArea({
        x: collisionObject.x,
        y: collisionObject.y,
      })
      if (isInArea) {
        this.wagon.state = "WAITING"
        this.wagon.speedPerSecond = 0
        return
      }
    }

    if (this.wagon.fuel <= 1) {
      this.wagon.state = "WAITING"
      this.wagon.speedPerSecond = 0
      return
    }

    if (this.wagon.state === "WAITING") {
      this.wagon.state = "IDLE"
    }
    if (this.wagon.state === "IDLE") {
      const target = this.routeService.route?.getNextFlag()
      if (target) {
        this.wagon.target = target
        this.wagon.state = "MOVING"
      }
    }
    if (this.wagon.state === "MOVING") {
      this.wagon.speedPerSecond = 0.5
      const isMoving = this.wagon.move()

      if (!isMoving) {
        if (
          this.wagon.target instanceof Flag &&
          this.wagon.target.type === "WAGON_MOVEMENT"
        ) {
          this.routeService.route?.removeFlag(this.wagon.target)
          this.wagon.target = undefined
          this.wagon.state = "IDLE"
          this.wagon.speedPerSecond = 0
        }
      }
    }

    this.wagon.live()
  }

  private updateFlags() {
    for (const flag of this.nearFlags) {
      flag.x = this.wagon.x + flag.offsetX
      flag.y = this.wagon.y + flag.offsetY
    }
    for (const flag of this.outFlags) {
      flag.x = this.wagon.x + flag.offsetX
      flag.y = this.wagon.y + flag.offsetY
    }
  }

  private initOutFlags(count = 20) {
    for (let i = 0; i < count; i++) {
      this.outFlags.push(this.generateRandomOutFlag())
    }
  }

  private initNearFlags(count = 20) {
    for (let i = 0; i < count; i++) {
      this.nearFlags.push(this.generateRandomNearFlag())
    }
  }

  private generateRandomOutFlag() {
    const minOffsetX = 1800
    const minOffsetY = 1200

    const offsetX =
      getRandomInRange(minOffsetX, minOffsetX * 1.5) * getMinusOrPlus()
    const offsetY =
      getRandomInRange(minOffsetY, minOffsetY * 1.5) * getMinusOrPlus()

    return new Flag({
      scene: this.scene,
      type: "OUT_OF_SCREEN",
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })
  }

  private generateRandomNearFlag() {
    const minRadius = 280
    const maxRadius = minRadius * 1.1

    const angle = Math.random() * Math.PI * 2
    const radius = getRandomInRange(minRadius, maxRadius)

    const offsetX = Math.round(Math.cos(angle) * radius)
    const offsetY = Math.round(Math.sin(angle) * radius)

    return new Flag({
      scene: this.scene,
      type: "WAGON_NEAR_MOVEMENT",
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })
  }
}
