import { createId } from '@paralleldrive/cuid2'
import type { IGameObjectWagon } from '../../../../../packages/api-sdk/src'
import { Inventory } from '../common'
import { GameObject } from './gameObject'
import { Mechanic } from './units'

interface IWagonOptions {
  x: number
  y: number
}

export class Wagon extends GameObject implements IGameObjectWagon {
  public fuel: number
  public visibilityArea!: IGameObjectWagon['visibilityArea']
  public cargoType: IGameObjectWagon['cargoType']

  public cargo: Inventory | undefined
  public mechanic!: Mechanic
  public serverDataArea!: IGameObjectWagon['visibilityArea']
  public collisionArea!: IGameObjectWagon['visibilityArea']

  constructor({ x, y }: IWagonOptions) {
    const finalId = createId()

    super({ id: finalId, x, y, entity: 'WAGON', isVisibleOnClient: true })

    this.needToSendDataToClient = true
    this.speed = 0
    this.fuel = 2000
    this.updateVisibilityArea()
    this.updateServerDataArea()
    this.initMechanic()
  }

  live() {
    this.updateVisibilityArea()
    this.updateServerDataArea()
    this.updateCollisionArea()
    this.updateMechanic()
    this.consumeFuel()

    if (this.state === 'IDLE') {
      this.handleChange()
      return
    }
    if (this.state === 'WAITING') {
      this.handleChange()
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

  refuel(woodAmount: number) {
    if (woodAmount < 0) {
      return
    }

    this.fuel += woodAmount * 5 * 40
  }

  emptyFuel() {
    this.fuel = 0
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

  public checkIfPointInCollisionArea(point: { x: number, y: number }) {
    return (
      this.collisionArea.startX < point.x
      && point.x < this.collisionArea.endX
      && this.collisionArea.startY < point.y
      && point.y < this.collisionArea.endY
    )
  }

  public checkIfPointInVisibilityArea(point: { x: number, y: number }) {
    return (
      this.visibilityArea.startX < point.x
      && point.x < this.visibilityArea.endX
      && this.visibilityArea.startY < point.y
      && point.y < this.visibilityArea.endY
    )
  }

  public checkIfPointInServerDataArea(point: { x: number, y: number }) {
    return (
      this.serverDataArea.startX < point.x
      && point.x < this.serverDataArea.endX
      && this.serverDataArea.startY < point.y
      && point.y < this.serverDataArea.endY
    )
  }

  initMechanic() {
    this.mechanic = new Mechanic({ x: this.x, y: this.y })
  }

  updateMechanic() {
    this.mechanic.isVisibleOnClient = true
    this.mechanic.needToSendDataToClient = true
    this.mechanic.live()
    this.mechanic.direction = 'LEFT'
    this.mechanic.x = this.x - 50
    this.mechanic.y = this.y - 48
  }

  public setCargo() {
    this.cargo = new Inventory({
      id: createId(),
      saveInDb: false,
      objectId: this.id,
    })
    void this.cargo.addOrCreateItem('WOOD', 100)
    this.cargoType = 'CHEST'
  }

  public emptyCargo() {
    this.cargo = undefined
    this.cargoType = undefined
  }
}
