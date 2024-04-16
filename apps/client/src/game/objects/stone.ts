import { Sprite } from "pixi.js";
import type { IGameObjectStone } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameObjectContainer } from "./gameObjectContainer";

interface IStoneOptions {
  game: Game;
  object: IGameObjectStone;
}

export class Stone extends GameObjectContainer implements IGameObjectStone {
  public type!: IGameObjectStone["type"];
  public resource!: number;
  public size!: number;

  public animationAngle = 0;
  public animationHighSpeed = 0.05;

  constructor({ game, object }: IStoneOptions) {
    super({ game, ...object });

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

  update(object: IGameObjectStone) {
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
