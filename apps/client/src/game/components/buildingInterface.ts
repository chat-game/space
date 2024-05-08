import { Sprite, Text } from "pixi.js"
import type { IGameObjectBuilding } from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

export class BuildingInterface extends GraphicsContainer {
  public building: IGameObjectBuilding

  public wood = 0
  public stone = 0

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
    this.children = []
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
      this.wood = wood ?? 0
      this.stone = stone ?? 0
      this.rebuild()
    }

    this.wood = wood ?? 0
    this.stone = stone ?? 0
  }

  drawWood() {
    if (this.wood <= 0) {
      return
    }

    const container = new GraphicsContainer({ type: "PLAYER_COINS" })

    const woodSprite = Sprite.from("wood1")
    woodSprite.width = 48
    woodSprite.height = 48

    const basicText = new Text({
      text: this.wood,
      style: {
        fontSize: 16,
        fill: 0xfef3c7,
        align: "left",
      },
    })

    basicText.x = 14
    basicText.y = 26

    container.addChild(woodSprite, basicText)

    container.x = -50
    container.y = -74

    this.addChild(container)
  }

  drawStone() {
    if (this.stone <= 0) {
      return
    }

    const container = new GraphicsContainer({ type: "PLAYER_COINS" })

    const sprite = Sprite.from("stoneRes1")
    sprite.width = 48
    sprite.height = 48

    const basicText = new Text({
      text: this.stone,
      style: {
        fontSize: 16,
        fill: 0xfef3c7,
        align: "left",
      },
    })

    basicText.x = 14
    basicText.y = 26

    container.addChild(sprite, basicText)

    container.x = 4
    container.y = -74

    this.addChild(container)
  }
}
