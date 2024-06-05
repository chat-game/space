import type { IGameObjectRaider } from "../../../../../../packages/api-sdk/src"
import type { GameScene } from "../../scenes/gameScene.ts"
import { Unit } from "./unit"

interface IRaiderOptions {
  scene: GameScene
  x: number
  y: number
}

export class Raider extends Unit implements IGameObjectRaider {
  constructor({ scene, x, y }: IRaiderOptions) {
    super({
      scene,
      x,
      y,
    })

    this.speedPerSecond = 1.5
    this.userName = "Raider"

    this.initVisual({
      head: "1",
      hairstyle: "BOLD",
      top: "BLACK_SHIRT",
    })
  }
}
