import { UnitObject } from './unitObject'
import type { GameScene, IGameObjectRaider } from '$lib/game/types'

interface RaiderOptions {
  scene: GameScene
  x: number
  y: number
}

export class Raider extends UnitObject implements IGameObjectRaider {
  constructor({ scene, x, y }: RaiderOptions) {
    super({
      scene,
      x,
      y,
      type: 'RAIDER',
    })

    this.speedPerSecond = 1.5
    this.userName = 'Raider'

    this.initVisual({
      head: '1',
      hairstyle: 'BOLD',
      top: 'BLACK_SHIRT',
    })
  }
}
