import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { UnitObject } from './unitObject'
import type { GameScene, IGameObjectCourier } from '$lib/game/types'

interface CourierOptions {
  scene: GameScene
  x: number
  y: number
}

export class Courier extends UnitObject implements IGameObjectCourier {
  constructor({ scene, x, y }: CourierOptions) {
    super({
      scene,
      x,
      y,
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
