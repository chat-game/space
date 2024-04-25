import { Sprite } from "pixi.js";
import type {
  IGameObjectDirection,
  IGameObjectUnit,
} from "../../../../../packages/api-sdk/src";
import { GraphicsContainer } from "./graphicsContainer";

interface IUnitHairContainerOptions {
  direction: IGameObjectDirection;
  visual: IGameObjectUnit["visual"]["hairstyle"];
}

export class UnitHairContainer extends GraphicsContainer {
  public visual: IGameObjectUnit["visual"]["hairstyle"];

  constructor({ direction, visual }: IUnitHairContainerOptions) {
    super({ type: "UNIT_HAIR", direction });
    this.visual = visual;
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    visual: IGameObjectUnit["visual"]["hairstyle"],
  ) {
    const sprite = Sprite.from(spriteIndex);
    sprite.anchor.set(0.5, 1);

    const container = new UnitHairContainer({ direction, visual });
    container.addChild(sprite);

    return container;
  }

  static getAll() {
    return [
      UnitHairContainer.create("unitHairClassicLeft", "LEFT", "CLASSIC"),
      UnitHairContainer.create("unitHairClassicRight", "RIGHT", "CLASSIC"),
    ];
  }
}
