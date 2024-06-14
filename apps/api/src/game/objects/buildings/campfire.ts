import type { IGameBuildingCampfire } from '../../../../../../packages/api-sdk/src'
import { Building } from './building'

interface ICampfireOptions {
  x: number
  y: number
}

export class Campfire extends Building implements IGameBuildingCampfire {
  constructor({ x, y }: ICampfireOptions) {
    super({ entity: 'CAMPFIRE', x, y })
  }
}
