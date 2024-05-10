import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectArea,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { GameObject } from "./gameObject"

interface IAreaOptions {
  theme: IGameObjectArea["theme"]
  area: IGameObjectArea["area"]
}

export class Area extends GameObject implements IGameObjectArea {
  theme: IGameObjectArea["theme"]
  area: IGameObjectArea["area"]

  constructor({ theme, area }: IAreaOptions) {
    const id = createId()
    const x = area.startX
    const y = area.startY

    super({ id, x, y, entity: "AREA" })

    this.theme = theme
    this.area = area
  }

  live() {
    if (this.state === "IDLE") {
      const random = getRandomInRange(1, 500)
      if (random <= 1) {
        this.handleChange()
      }
      return
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated()
  }
}
