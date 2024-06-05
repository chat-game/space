import type { IGameObjectFarmer } from "../../../../../../packages/api-sdk/src"
import { generateUnitUserName } from "../../common/generators/unitName.ts"
import { generateUnitTop } from "../../common/generators/unitTop.ts"
import type { GameScene } from "../../scenes/gameScene.ts"
import { Unit } from "./unit"

interface IFarmerOptions {
  scene: GameScene
  x: number
  y: number
}

export class Farmer extends Unit implements IGameObjectFarmer {
  constructor({ scene, x, y }: IFarmerOptions) {
    super({
      scene,
      x,
      y,
    })

    this.speedPerSecond = 70
    this.minDistance = 10
    this.userName = generateUnitUserName()

    this.initVisual({
      head: "1",
      hairstyle: "ORANGE_WITH_BEARD",
      top: generateUnitTop(),
    })
  }
}
