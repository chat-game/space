import { Sprite } from "pixi.js"
import type { IGameObjectBuilding } from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

export class BuildingInterface extends GraphicsContainer {
  public building: IGameObjectBuilding

  public wood: number | undefined
  public stone: number | undefined

  constructor(building: IGameObjectBuilding) {
    super({ type: "INTERFACE" })

    this.x = 0
    this.y = 0

    this.building = building

    this.init()
  }

  init() {
    this.wood =
      this.building.inventory.items.find((item) => item.type === "WOOD")
        ?.amount ?? 0
    this.stone =
      this.building.inventory.items.find((item) => item.type === "STONE")
        ?.amount ?? 0

    this.drawWood()
    this.drawStone()
  }

  rebuild() {
    this.removeChild(...this.children)
    this.drawWood()
    this.drawStone()
  }

  animate() {
    this.visible = true
    this.update()
  }

  update() {
    const wood = this.building.inventory.items.find(
      (item) => item.type === "WOOD",
    )?.amount
    const stone = this.building.inventory.items.find(
      (item) => item.type === "STONE",
    )?.amount

    if (wood !== this.wood || stone !== this.stone) {
      this.wood = wood
      this.stone = stone
      this.rebuild()
    }

    this.wood = wood
    this.stone = stone
  }

  drawWood() {
    if (!this.wood || this.wood <= 0) {
      return
    }

    const container = new GraphicsContainer({ type: "PLAYER_COINS" })

    const woodSprite = Sprite.from("wood1")
    woodSprite.width = 48
    woodSprite.height = 48

    // const basicText = new Text({
    //   text: this.wood,
    //   style: {
    //     fontSize: 16,
    //     fill: 0xfef3c7,
    //     align: "left",
    //   },
    // })
    //
    // basicText.x = 14
    // basicText.y = 26

    container.addChild(woodSprite)

    container.x = -50
    container.y = -74

    this.addChild(container)
  }

  drawStone() {
    if (!this.stone || this.stone <= 0) {
      return
    }

    const container = new GraphicsContainer({ type: "PLAYER_COINS" })

    const sprite = Sprite.from("stoneRes1")
    sprite.width = 48
    sprite.height = 48

    // const basicText = new Text({
    //   text: this.stone,
    //   style: {
    //     fontSize: 16,
    //     fill: 0xfef3c7,
    //     align: "left",
    //   },
    // })
    //
    // basicText.x = 14
    // basicText.y = 26

    container.addChild(sprite)

    container.x = 4
    container.y = -74

    this.addChild(container)
  }
}
