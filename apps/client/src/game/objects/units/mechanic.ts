import type { IGameObjectMechanic } from "../../../../../../packages/api-sdk/src"
import type { GameScene } from "../../scenes/gameScene.ts"
import { Unit } from "./unit"

interface IMechanicOptions {
  scene: GameScene
  x: number
  y: number
}

export class Mechanic extends Unit implements IGameObjectMechanic {
  constructor({ scene, x, y }: IMechanicOptions) {
    super({
      scene,
      x,
      y,
    })

    this.userName = "Mechanic"

    this.initVisual({
      head: "1",
      hairstyle: "COAL_LONG",
      top: "DARK_SILVER_SHIRT",
    })
  }

  public animate() {
    super.animate()

    this.zIndex = Math.round(this.y + 100)
  }
}
