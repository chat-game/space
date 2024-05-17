import type { IGameBuildingStore } from "../../../../../../packages/api-sdk/src"
import { Building } from "./building"

interface IStoreOptions {
  x: number
  y: number
}

export class Store extends Building implements IGameBuildingStore {
  constructor({ x, y }: IStoreOptions) {
    super({ entity: "STORE", x, y })
  }
}
