import { Sprite } from "pixi.js"
import type { IGameBuildingStore } from "../../../../../../packages/api-sdk/src"
import type { Game } from "../../game"
import { Building } from "./building"

interface IStoreOptions {
  game: Game
  object: IGameBuildingStore
}

export class Store extends Building implements IGameBuildingStore {
  constructor({ game, object }: IStoreOptions) {
    super({ game, object })

    this.init()
  }

  init() {
    const sprite = Sprite.from("store1")
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  update(object: IGameBuildingStore) {
    super.update(object)

    this.zIndex = Math.round(object.y - 5)
  }
}
