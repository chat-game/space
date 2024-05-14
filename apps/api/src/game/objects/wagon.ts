import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectWagon,
  getMinusOrPlus,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { Flag } from "./flag"
import { GameObject } from "./gameObject"
import { Mechanic } from "./units"

interface IWagonOptions {
  x: number
  y: number
}

export class Wagon extends GameObject implements IGameObjectWagon {
  public fuel: number
  public visibilityArea!: IGameObjectWagon["visibilityArea"]

  public mechanic!: Mechanic
  public serverDataArea!: IGameObjectWagon["visibilityArea"]
  public collisionArea!: IGameObjectWagon["visibilityArea"]
  public nearFlags: Flag[] = []
  public outFlags: Flag[] = []

  constructor({ x, y }: IWagonOptions) {
    const finalId = createId()

    super({ id: finalId, x, y, entity: "WAGON", isVisibleOnClient: true })

    this.speed = 0
    this.fuel = 2000
    this.updateVisibilityArea()
    this.updateServerDataArea()
    this.initNearFlags()
    this.initOutFlags(10)
    this.initMechanic()
  }

  live() {
    this.updateVisibilityArea()
    this.updateServerDataArea()
    this.updateCollisionArea()
    this.updateFlags()
    this.updateMechanic()
    this.consumeFuel()

    if (this.state === "IDLE") {
      this.handleChange()
      return
    }
    if (this.state === "WAITING") {
      this.handleChange()
      return
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated()
  }

  consumeFuel() {
    if (this.speed <= 0) {
      return
    }

    this.fuel -= this.speed * 2
  }

  updateVisibilityArea() {
    const offsetX = 2560 / 2
    const offsetY = 1440 / 2

    this.visibilityArea = {
      startX: this.x - offsetX,
      endX: this.x + offsetX,
      startY: this.y - offsetY,
      endY: this.y + offsetY,
    }
  }

  updateServerDataArea() {
    const offsetX = 2560 * 1.5
    const offsetY = 1440

    this.serverDataArea = {
      startX: this.x - offsetX,
      endX: this.x + offsetX,
      startY: this.y - offsetY,
      endY: this.y + offsetY,
    }
  }

  updateCollisionArea() {
    const offsetX = 250
    const offsetY = 180

    this.collisionArea = {
      startX: this.x - offsetX,
      endX: this.x + offsetX,
      startY: this.y - offsetY,
      endY: this.y + offsetY,
    }
  }

  public checkIfPointInCollisionArea(point: { x: number; y: number }) {
    return (
      this.collisionArea.startX < point.x &&
      point.x < this.collisionArea.endX &&
      this.collisionArea.startY < point.y &&
      point.y < this.collisionArea.endY
    )
  }

  public checkIfPointInVisibilityArea(point: { x: number; y: number }) {
    return (
      this.visibilityArea.startX < point.x &&
      point.x < this.visibilityArea.endX &&
      this.visibilityArea.startY < point.y &&
      point.y < this.visibilityArea.endY
    )
  }

  public checkIfPointInServerDataArea(point: { x: number; y: number }) {
    return (
      this.serverDataArea.startX < point.x &&
      point.x < this.serverDataArea.endX &&
      this.serverDataArea.startY < point.y &&
      point.y < this.serverDataArea.endY
    )
  }

  initMechanic() {
    this.mechanic = new Mechanic({ x: this.x, y: this.y })
  }

  updateMechanic() {
    this.mechanic.isVisibleOnClient = true
    this.mechanic.needToSendDataToClient = true
    this.mechanic.live()
    this.mechanic.direction = "LEFT"
    this.mechanic.x = this.x - 50
    this.mechanic.y = this.y - 48
  }

  initNearFlags() {
    const flag1 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x - 300,
      y: this.y,
      offsetX: -300,
      offsetY: 0,
    })
    const flag2 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x - 200,
      y: this.y + 50,
      offsetX: -200,
      offsetY: 50,
    })
    const flag3 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x - 100,
      y: this.y + 100,
      offsetX: -100,
      offsetY: 100,
    })
    const flag4 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x,
      y: this.y + 200,
      offsetX: 0,
      offsetY: 200,
    })
    this.nearFlags.push(flag1, flag2, flag3, flag4)
  }

  updateFlags() {
    for (const flag of this.nearFlags) {
      flag.x = this.x + flag.offsetX
      flag.y = this.y + flag.offsetY
    }
    for (const flag of this.outFlags) {
      flag.x = this.x + flag.offsetX
      flag.y = this.y + flag.offsetY
    }
  }

  public findRandomNearFlag() {
    return this.nearFlags[Math.floor(Math.random() * this.nearFlags.length)]
  }

  initOutFlags(count: number) {
    for (let i = 0; i < count; i++) {
      this.outFlags.push(this.generateRandomOutFlag())
    }
  }

  generateRandomOutFlag() {
    const minOffsetX = 1800
    const minOffsetY = 1200

    const offsetX =
      getRandomInRange(minOffsetX, minOffsetX * 1.5) * getMinusOrPlus()
    const offsetY =
      getRandomInRange(minOffsetY, minOffsetY * 1.5) * getMinusOrPlus()

    return new Flag({
      type: "OUT_OF_SCREEN",
      x: this.x + offsetX,
      y: this.y + offsetY,
      offsetX,
      offsetY,
    })
  }

  public findRandomOutFlag() {
    return this.outFlags[Math.floor(Math.random() * this.outFlags.length)]
  }
}
