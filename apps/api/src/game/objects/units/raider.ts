import { createId } from "@paralleldrive/cuid2"
import type { IGameObjectRaider } from "../../../../../../packages/api-sdk/src"
import { Unit } from "./unit"

interface IRaiderOptions {
  x: number
  y: number
}

export class Raider extends Unit implements IGameObjectRaider {
  constructor({ x, y }: IRaiderOptions) {
    const objectId = createId()

    super({
      id: objectId,
      x,
      y,
      entity: "RAIDER",
      visual: {
        head: "1",
        hairstyle: "BOLD",
        top: "BLACK_SHIRT",
      },
    })

    this.speedPerSecond = 1.5
    this.userName = "Raider"
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
