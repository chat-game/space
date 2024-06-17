import { UnitObject } from './unitObject'
import type { Game, IGameObjectRaider } from '$lib/game/types'

interface RaiderOptions {
  game: Game
  x: number
  y: number
}

export class Raider extends UnitObject implements IGameObjectRaider {
  constructor({ game, x, y }: RaiderOptions) {
    super({
      game,
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
