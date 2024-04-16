import { ColorMatrixFilter, Container, Graphics, Sprite, Text } from "pixi.js";
import type {
  GameObjectDirection,
  GameObjectEntity,
  GameObjectRaider,
  GameObjectState,
} from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameContainer } from "./gameContainer";

export class Raider extends GameContainer implements GameObjectRaider {
  entity: GameObjectEntity;
  state!: GameObjectState;
  direction!: GameObjectDirection;
  userName!: string;
  colorIndex!: number;

  constructor(game: Game, object: GameObjectRaider) {
    super(game, object.id);

    this.update(object);
    this.init();
  }

  init() {
    const playerLeftSprite = Sprite.from("playerLeft");
    const playerTopLeftSprite = Sprite.from("playerTopLeft");
    const playerRightSprite = Sprite.from("playerRight");
    const playerTopRightSprite = Sprite.from("playerTopRight");

    playerLeftSprite.anchor.set(0.5, 1);
    playerTopLeftSprite.anchor.set(0.5, 1);
    playerRightSprite.anchor.set(0.5, 1);
    playerTopRightSprite.anchor.set(0.5, 1);

    playerLeftSprite.direction = "LEFT";
    playerTopLeftSprite.direction = "LEFT";
    playerRightSprite.direction = "RIGHT";
    playerTopRightSprite.direction = "RIGHT";

    const filterBrightness = new ColorMatrixFilter();
    filterBrightness.brightness(0.3, false);

    playerTopRightSprite.filters = [filterBrightness];
    playerTopLeftSprite.filters = [filterBrightness];

    const playerInterface = new Container();

    const basicText = new Text({
      text: this.userName,
      style: {
        fontSize: 14,
        fill: 0x78350f,
        align: "left",
      },
    });

    const graphics = new Graphics();
    graphics.roundRect(-5, -2, basicText.width + 5, basicText.height + 2, 5);
    graphics.fill(0xfef3c7);

    playerInterface.addChild(graphics, basicText);
    playerInterface.type = "interface";

    this.addChild(
      playerInterface,
      playerLeftSprite,
      playerTopLeftSprite,
      playerRightSprite,
      playerTopRightSprite,
    );
  }

  animate() {
    // Hide all
    for (const t of this.children) {
      t.visible = false;
    }

    // Show text
    for (const t of this.children) {
      if (t?.type === "interface") {
        t.visible = true;
      }
    }

    // Visible only needed
    const sprites = this.children.filter((t) => t.direction === this.direction);
    for (const sprite of sprites) {
      sprite.visible = true;
    }
  }

  update(object: GameObjectRaider) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y + 1);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;

    this.userName = object.userName;
    this.colorIndex = object.colorIndex;
  }
}
