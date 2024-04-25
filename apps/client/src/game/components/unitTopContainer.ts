import { Sprite } from "pixi.js";
import type {
  IGameObjectDirection,
  IGameObjectUnit,
} from "../../../../../packages/api-sdk/src";
import { GraphicsContainer } from "./graphicsContainer.ts";

interface IUnitTopContainerOptions {
  direction: IGameObjectDirection;
  visual: IGameObjectUnit["visual"]["top"];
}

export class UnitTopContainer extends GraphicsContainer {
  public visual: IGameObjectUnit["visual"]["top"];

  constructor({ direction, visual }: IUnitTopContainerOptions) {
    super({ type: "UNIT_TOP", direction });
    this.visual = visual;
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    visual: IGameObjectUnit["visual"]["top"],
  ) {
    const sprite = Sprite.from(spriteIndex);
    sprite.anchor.set(0.5, 1);

    const container = new UnitTopContainer({ direction, visual });
    container.addChild(sprite);

    return container;
  }

  static getAll() {
    return [
      UnitTopContainer.create("violetTopLeft", "LEFT", "VIOLET_SHIRT"),
      UnitTopContainer.create("violetTopRight", "RIGHT", "VIOLET_SHIRT"),
      UnitTopContainer.create("blackTopLeft", "LEFT", "BLACK_SHIRT"),
      UnitTopContainer.create("blackTopRight", "RIGHT", "BLACK_SHIRT"),
      UnitTopContainer.create("greenTopLeft", "LEFT", "GREEN_SHIRT"),
      UnitTopContainer.create("greenTopRight", "RIGHT", "GREEN_SHIRT"),
      UnitTopContainer.create("blueTopLeft", "LEFT", "BLUE_SHIRT"),
      UnitTopContainer.create("blueTopRight", "RIGHT", "BLUE_SHIRT"),
    ];
  }
}
