import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import type { GameScene } from '../../scenes/gameScene'
import { Unit } from './unit'
import type { IGameObjectTrader } from '$lib/game/types'

interface ITraderOptions {
  scene: GameScene
  x: number
  y: number
}

export class Trader extends Unit implements IGameObjectTrader {
  constructor({ scene, x, y }: ITraderOptions) {
    super({
      scene,
      x,
      y,
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
