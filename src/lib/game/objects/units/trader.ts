import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { UnitObject } from './unitObject'
import type { GameScene, IGameObjectTrader } from '$lib/game/types'

interface ITraderOptions {
  scene: GameScene
  x: number
  y: number
}

export class Trader extends UnitObject implements IGameObjectTrader {
  constructor({ scene, x, y }: ITraderOptions) {
    super({
      scene,
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
