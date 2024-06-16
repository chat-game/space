import { UnitObject } from './unitObject'
import type { GameScene, IGameObjectMechanic } from '$lib/game/types'

interface IMechanicOptions {
  scene: GameScene
  x: number
  y: number
}

export class Mechanic extends UnitObject implements IGameObjectMechanic {
  constructor({ scene, x, y }: IMechanicOptions) {
    super({
      scene,
      x,
      y,
      type: 'MECHANIC',
    })

    this.userName = 'Mechanic'

    this.initVisual({
      head: '1',
      hairstyle: 'COAL_LONG',
      top: 'DARK_SILVER_SHIRT',
    })
  }

  animate() {
    super.animate()

    this.zIndex = Math.round(this.y + 100)
  }
}
