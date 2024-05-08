import { Sprite } from "pixi.js"
import type {
  IGameObjectDirection,
  IGameObjectUnit,
} from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

interface IUnitHeadContainerOptions {
  direction: IGameObjectDirection
  visual: IGameObjectUnit["visual"]["head"]
}

export class UnitHeadContainer extends GraphicsContainer {
  public visual: IGameObjectUnit["visual"]["head"]

  constructor({ direction, visual }: IUnitHeadContainerOptions) {
    super({ type: "UNIT_HEAD", direction })
    this.visual = visual
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    visual: IGameObjectUnit["visual"]["head"],
  ) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 1)

    const container = new UnitHeadContainer({ direction, visual })
    container.addChild(sprite)

    return container
  }

  static getAll() {
    return [
      UnitHeadContainer.create("unitHead1Left", "LEFT", "1"),
      UnitHeadContainer.create("unitHead1Right", "RIGHT", "1"),
    ]
  }
}
