import { Sprite } from "pixi.js";
import type {
  GameObjectDirection,
  GameObjectEntity,
  GameObjectState,
  GameObjectStone,
} from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameContainer } from "./gameContainer";

export class Stone extends GameContainer implements GameObjectStone {
  entity: GameObjectEntity;
  state!: GameObjectState;
  direction!: GameObjectDirection;
  health!: number;
  resource!: number;
  size!: number;
  public type!: GameObjectStone["type"];

  public animationAngle = 0;
  public animationHighSpeed = 0.05;

  constructor(game: Game, object: GameObjectStone) {
    super(game, object.id);

    this.update(object);
    this.init();
  }

  init() {
    const sprite = this.getSpriteByType();
    if (sprite) {
      sprite.anchor.set(0.5, 1);
      this.addChild(sprite);
    }
  }

  getSpriteByType() {
    if (this.type === "1") {
      return Sprite.from("stone1");
    }
  }

  animate() {
    if (this.state === "DESTROYED") {
      this.visible = false;
    }

    if (this.state === "MINING") {
      this.scale = 0.98;
      this.shakeAnimation();
    }
  }

  shakeAnimation() {
    if (Math.abs(this.animationAngle) >= 0.5) {
      this.animationHighSpeed *= -1;
    }
    this.animationAngle += this.animationHighSpeed;
    this.angle = this.animationAngle;
  }

  update(object: GameObjectStone) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.type = object.type;
    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
    this.resource = object.resource;
    this.size = object.size;
  }
}
