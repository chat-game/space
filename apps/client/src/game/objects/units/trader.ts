import type { IGameObjectTrader } from "../../../../../../packages/api-sdk/src"
import { generateUnitUserName } from "../../common/generators/unitName.ts"
import { generateUnitTop } from "../../common/generators/unitTop.ts"
import type { GameScene } from "../../scenes/gameScene.ts"
import { Unit } from "./unit"

interface ITraderOptions {
  scene: GameScene
  x: number
  y: number
}

export class Trader extends Unit implements IGameObjectTrader {
  constructor({ scene, x, y }: ITraderOptions) {
    super({
      scene,
      x,
      y,
    })

    this.speedPerSecond = 60
    this.minDistance = 5
    this.userName = generateUnitUserName()

    this.initVisual({
      head: "1",
      hairstyle: "COAL_LONG",
      top: generateUnitTop(),
    })
  }
}
