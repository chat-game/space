import { createId } from "@paralleldrive/cuid2"
import type { IGameObjectRaider } from "../../../../../../packages/api-sdk/src"
import type { GameObject } from "../gameObject"
import { Unit } from "./unit"

interface IRaiderOptions {
  x: number
  y: number
}

export class Raider extends Unit implements IGameObjectRaider {
  public userName = ""
  public colorIndex = 0

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
  }

  live() {
    if (this.state === "IDLE") {
      this.sendMessageObjectUpdated()
      return
    }

    if (this.state === "MOVING") {
      this.sendMessageObjectUpdated()
      return
    }
  }

  moveOutOfScene(target: GameObject) {
    this.target = target
    this.state = "MOVING"
  }
}
