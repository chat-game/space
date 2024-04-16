import { Sprite } from "pixi.js";
import type {
  GameObject,
  GameObjectDirection,
  GameObjectEntity,
  GameObjectState,
} from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameContainer } from "./gameContainer";

export class Rabbit extends GameContainer implements GameObject {
  entity: GameObjectEntity;
  state!: GameObjectState;
  direction!: GameObjectDirection;

  public animationAngle = 0;

  constructor(game: Game, object: GameObject) {
    super(game, object.id);

    this.update(object);
    this.init();
  }

  init() {
    const spriteRight = Sprite.from("rabbitRight");
    const spriteLeft = Sprite.from("rabbitLeft");

    spriteRight.anchor.set(0.5, 1);
    spriteLeft.anchor.set(0.5, 1);

    spriteLeft.direction = "LEFT";
    spriteRight.direction = "RIGHT";

    this.addChild(spriteRight, spriteLeft);
  }

  animate() {
    // Hide all
    for (const t of this.children) {
      t.visible = false;
    }

    // Visible only 1
    const sprite = this.children.find((t) => t.direction === this.direction);
    if (sprite) {
      sprite.visible = true;
    }

    if (this.state === "MOVING") {
      this.angle = this.animationAngle;
      this.shakeAnimation();
    }
  }

  shakeAnimation() {
    if (this.animationAngle >= 4) {
      this.animationAngle = 0;
      return;
    }
    this.animationAngle += 0.08;
  }

  update(object: GameObject) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
  }
}
