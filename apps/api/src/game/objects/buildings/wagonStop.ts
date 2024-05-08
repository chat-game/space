import type { IGameBuildingWagonStop } from "../../../../../../packages/api-sdk/src"
import { Building } from "./building"

interface IWagonStopOptions {
  x: number
  y: number
}

export class WagonStop extends Building implements IGameBuildingWagonStop {
  constructor({ x, y }: IWagonStopOptions) {
    super({ entity: "WAGON_STOP", x, y })
  }
}
