import { Sprite } from "pixi.js"
import type { IGameBuildingWagonStop } from "$lib/game/types"
import type { GameScene } from "../../scenes/gameScene.ts"
import { Building } from "./building"

interface IWagonStopOptions {
  scene: GameScene
  x: number
  y: number
}

export class WagonStop extends Building implements IGameBuildingWagonStop {
  constructor({ scene, x, y }: IWagonStopOptions) {
    super({ scene, x, y })

    this.initGraphics()
  }

  private initGraphics() {
    const sprite = Sprite.from("wagonStop1")
    if (sprite) {
      sprite.anchor.set(0.5, 0.92)
      this.addChild(sprite)
    }
  }

  animate() {
    super.animate()

    this.zIndex = Math.round(this.y - 100)
  }
}