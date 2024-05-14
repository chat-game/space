import { createId } from "@paralleldrive/cuid2"
import type { IGameObjectMechanic } from "../../../../../../packages/api-sdk/src"
import { Unit } from "./unit"

interface IMechanicOptions {
  x: number
  y: number
}

export class Mechanic extends Unit implements IGameObjectMechanic {
  constructor({ x, y }: IMechanicOptions) {
    const id = createId()

    super({
      id,
      x,
      y,
      entity: "MECHANIC",
      visual: {
        head: "1",
        hairstyle: "COAL_LONG",
        top: "DARK_SILVER_SHIRT",
      },
    })
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
