import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectWolf,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config"
import { GameObject } from "./gameObject"

export class Wolf extends GameObject implements IGameObjectWolf {
  constructor() {
    const id = createId()
    const x = getRandomInRange(MIN_X, MAX_X)
    const y = getRandomInRange(MIN_Y, MAX_Y)

    super({ id, x, y, entity: "WOLF" })
  }

  live() {
    if (this.state === "IDLE") {
      this.sendMessageObjectUpdated()
      return
    }

    if (this.state === "MOVING") {
      this.move()

      this.sendMessageObjectUpdated()
      return
    }
  }
}
