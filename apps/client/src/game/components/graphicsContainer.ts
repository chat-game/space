import { ColorMatrixFilter, Container, Sprite } from "pixi.js";
import type { GameObjectDirection } from "../../../../../packages/api-sdk/src";

type GraphicsContainerType =
  | "INTERFACE"
  | "PLAYER_IDLE_LEFT"
  | "PLAYER_IDLE_RIGHT"
  | "PLAYER_COINS"
  | "PLAYER_WOOD"
  | "PLAYER_STONE"
  | "PLAYER_AXE"
  | "PLAYER_PICKAXE"
  | "PLAYER_TOP_RIGHT"
  | "PLAYER_TOP_LEFT"
  | "PLAYER_MOVING_RIGHT"
  | "PLAYER_MOVING_LEFT";

export class GraphicsContainer extends Container {
  public type: GraphicsContainerType;
  public direction: GameObjectDirection = "RIGHT";

  constructor(type: GraphicsContainerType, direction?: GameObjectDirection) {
    super();
    this.type = type;

    if (direction) {
      this.direction = direction;
    }
  }

  static createWithSprite(
    spriteIndex: string,
    direction: GameObjectDirection,
    type: GraphicsContainerType,
  ) {
    const sprite = Sprite.from(spriteIndex);
    sprite.anchor.set(0.5, 1);

    const container = new GraphicsContainer(type, direction);
    container.addChild(sprite);

    return container;
  }

  static addFiltersToPlayersTop(
    container: GraphicsContainer,
    colorIndex: number,
  ) {
    const filterHue = new ColorMatrixFilter();
    filterHue.hue(colorIndex, false);
    const filterBrightness = new ColorMatrixFilter();
    filterBrightness.brightness(0.9, false);

    container.filters = [filterHue, filterBrightness];
  }
}
