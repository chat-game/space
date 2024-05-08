import { Sprite } from "pixi.js"
import type { IGameBuildingWarehouse } from "../../../../../../packages/api-sdk/src"
import { BuildingInterface } from "../../components/buildingInterface"
import type { Game } from "../../game"
import { Building } from "./building"

interface IWarehouseOptions {
  game: Game
  object: IGameBuildingWarehouse
}

export class Warehouse extends Building implements IGameBuildingWarehouse {
  public interface!: BuildingInterface

  constructor({ game, object }: IWarehouseOptions) {
    super({ game, object })

    this.init()
    this.initInterface()
  }

  init() {
    const sprite = Sprite.from("warehouse1")
    if (sprite) {
      sprite.anchor.set(0.5, 1)
      this.addChild(sprite)
    }
  }

  initInterface() {
    this.interface = new BuildingInterface(this)
    this.addChild(this.interface)
  }

  animate() {
    super.animate()

    this.interface.animate()
  }
}
