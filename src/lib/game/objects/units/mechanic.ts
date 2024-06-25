import { UnitObject } from './unitObject'
import type { Game, IGameObjectMechanic } from '$lib/game/types'

interface IMechanicOptions {
  game: Game
  x: number
  y: number
}

export class Mechanic extends UnitObject implements IGameObjectMechanic {
  constructor({ game, x, y }: IMechanicOptions) {
    super({
      game,
      x,
      y,
      type: 'MECHANIC',
    })

    this.name = 'Mechanic'

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
