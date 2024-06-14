import type { IGameBuildingConstructionArea } from '../../../../../../packages/api-sdk/src'
import { Building } from './building'

interface IConstructionAreaOptions {
  x: number
  y: number
}

export class ConstructionArea
  extends Building
  implements IGameBuildingConstructionArea {
  constructor({ x, y }: IConstructionAreaOptions) {
    super({ entity: 'CONSTRUCTION_AREA', x, y })
  }
}
