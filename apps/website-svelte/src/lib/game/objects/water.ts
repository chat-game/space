import { BaseObject } from './baseObject'
import type { Game, IGameObjectWater } from '$lib/game/types'

interface IWaterOptions {
  game: Game
  x: number
  y: number
}

export class Water extends BaseObject implements IGameObjectWater {
  constructor({ game, x, y }: IWaterOptions) {
    super({ game, x, y, type: 'WATER' })
  }
}
