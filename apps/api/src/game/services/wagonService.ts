import {
  getMinusOrPlus,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { Flag, Wagon } from "../objects"
import type { GameScene } from "../scenes"
import { RouteService } from "./routeService"

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
    this.wagon = new Wagon({ x, y })

    this.initOutFlags(10)
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
        this.wagon.speed = 0
        this.wagon.handleChange()
        return
      }
    }

    if (this.wagon.fuel <= 1) {
      this.wagon.state = "WAITING"
      this.wagon.speed = 0
      this.wagon.handleChange()
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
      this.wagon.speed = 0.5
      const isMoving = this.wagon.move()
      this.wagon.handleChange()

      if (!isMoving) {
        if (
          this.wagon.target instanceof Flag &&
          this.wagon.target.type === "WAGON_MOVEMENT"
        ) {
          this.routeService.route?.removeFlag(this.wagon.target)
          this.wagon.target = undefined
          this.wagon.state = "IDLE"
          this.wagon.speed = 0
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

  private initOutFlags(count: number) {
    for (let i = 0; i < count; i++) {
      this.outFlags.push(this.generateRandomOutFlag())
    }
  }

  private initNearFlags() {
    const flag1 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.wagon.x - 300,
      y: this.wagon.y,
      offsetX: -300,
      offsetY: 0,
    })
    const flag2 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.wagon.x - 200,
      y: this.wagon.y + 50,
      offsetX: -200,
      offsetY: 50,
    })
    const flag3 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.wagon.x - 100,
      y: this.wagon.y + 100,
      offsetX: -100,
      offsetY: 100,
    })
    const flag4 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.wagon.x,
      y: this.wagon.y + 200,
      offsetX: 0,
      offsetY: 200,
    })
    this.nearFlags.push(flag1, flag2, flag3, flag4)
  }

  private generateRandomOutFlag() {
    const minOffsetX = 1800
    const minOffsetY = 1200

    const offsetX =
      getRandomInRange(minOffsetX, minOffsetX * 1.5) * getMinusOrPlus()
    const offsetY =
      getRandomInRange(minOffsetY, minOffsetY * 1.5) * getMinusOrPlus()

    return new Flag({
      type: "OUT_OF_SCREEN",
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })
  }
}
