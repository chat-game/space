import type { GameScene } from '../scenes/gameScene'
import { GameObject } from './gameObject'
import type { IGameObjectWater } from '$lib/game/types'

interface IWaterOptions {
  scene: GameScene
  x: number
  y: number
}

export class Water extends GameObject implements IGameObjectWater {
  constructor({ scene, x, y }: IWaterOptions) {
    super({ scene, x, y })
  }
}
