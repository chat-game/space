import { createId } from "@paralleldrive/cuid2"
import type { IGameObjectCourier } from "../../../../../../packages/api-sdk/src"
import { Unit } from "./unit"

interface ICourierOptions {
  x: number
  y: number
}

export class VillageCourier extends Unit implements IGameObjectCourier {
  constructor({ x, y }: ICourierOptions) {
    const id = createId()

    super({
      id,
      x,
      y,
      entity: "COURIER",
      visual: {
        head: "1",
        hairstyle: "BOLD",
        top: "BLUE_SHIRT",
      },
    })

    this.speed = 2.5
    this.minDistance = 15
  }

  live() {
    super.live()
    this.handleChange()
  }

  handleChange() {
    const prepared = {
      ...this,
      script: undefined,
      live: undefined,
    }

    this.sendMessageObjectUpdated(prepared)
  }
}
