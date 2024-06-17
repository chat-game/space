import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { UnitObject } from './unitObject'
import type { Game, IGameObjectCourier } from '$lib/game/types'

interface CourierOptions {
  game: Game
  x: number
  y: number
  chunkId?: string
}

export class Courier extends UnitObject implements IGameObjectCourier {
  constructor({ game, x, y, chunkId }: CourierOptions) {
    super({
      game,
      x,
      y,
      chunkId,
      type: 'VILLAGE_UNIT',
    })

    this.speedPerSecond = 100
    this.minDistance = 15
    this.userName = generateUnitUserName()

    this.initVisual({
      head: '1',
      hairstyle: 'BOLD',
      top: generateUnitTop(),
    })
  }
}
