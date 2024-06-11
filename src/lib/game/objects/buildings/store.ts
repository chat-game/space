import type { IGameBuildingStore } from "$lib/game/types"
import { Sprite } from "pixi.js"
import type { GameScene } from "../../scenes/gameScene.ts"
import { Building } from "./building"

interface IStoreOptions {
  scene: GameScene
  x: number
  y: number
}

export class Store extends Building implements IGameBuildingStore {
  constructor({ scene, x, y }: IStoreOptions) {
    super({ scene, x, y })

    this.initGraphics()
  }

  private initGraphics() {
    const sprite = Sprite.from("store1")
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }
}
