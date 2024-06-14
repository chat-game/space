import type { IGameBuildingWarehouse } from '../../../../../../packages/api-sdk/src'
import { Building } from './building'

interface IWarehouseOptions {
  x: number
  y: number
}

export class Warehouse extends Building implements IGameBuildingWarehouse {
  constructor({ x, y }: IWarehouseOptions) {
    super({ entity: 'WAREHOUSE', x, y })
  }
}
