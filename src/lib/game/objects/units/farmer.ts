import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { UnitObject } from './unitObject'
import type { Game, IGameObjectFarmer } from '$lib/game/types'

interface IFarmerOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Farmer extends UnitObject implements IGameObjectFarmer {
  constructor({ game, x, y, chunkId }: IFarmerOptions) {
    super({
      game,
      x,
      y,
      chunkId,
      type: 'VILLAGE_UNIT',
    })

    this.speedPerSecond = 70
    this.minDistance = 10
    this.userName = generateUnitUserName()

    this.initVisual({
      head: '1',
      hairstyle: 'ORANGE_WITH_BEARD',
      top: generateUnitTop(),
    })
  }
}
