import type { IGameObjectWater } from "../../../../../packages/api-sdk/src"
import { GameObject } from "./gameObject"
import { GameScene } from "../scenes/gameScene";

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
