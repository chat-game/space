import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { UnitObject } from './unitObject'
import type { GameScene, IGameObjectFarmer } from '$lib/game/types'

interface IFarmerOptions {
  scene: GameScene
  x: number
  y: number
}

export class Farmer extends UnitObject implements IGameObjectFarmer {
  constructor({ scene, x, y }: IFarmerOptions) {
    super({
      scene,
      x,
      y,
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
