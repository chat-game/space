import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { UnitObject } from './unitObject'
import type { Game, IGameObjectTrader } from '$lib/game/types'

interface ITraderOptions {
  game: Game
  x: number
  y: number
}

export class Trader extends UnitObject implements IGameObjectTrader {
  constructor({ game, x, y }: ITraderOptions) {
    super({
      game,
      x,
      y,
      type: 'TRADER',
    })

    this.speedPerSecond = 60
    this.minDistance = 5
    this.userName = generateUnitUserName()

    this.initVisual({
      head: '1',
      hairstyle: 'COAL_LONG',
      top: generateUnitTop(),
    })
  }
}
