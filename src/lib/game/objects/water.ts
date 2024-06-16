import { BaseObject } from './baseObject'
import type { GameScene, IGameObjectWater } from '$lib/game/types'

interface IWaterOptions {
  scene: GameScene
  x: number
  y: number
}

export class Water extends BaseObject implements IGameObjectWater {
  constructor({ scene, x, y }: IWaterOptions) {
    super({ scene, x, y, type: 'WATER' })
  }
}
